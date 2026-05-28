import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

export default function ProductCard({ product, addToCart }) {
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null
  );

  const [selectedImage, setSelectedImage] = useState(
    product?.images?.[0] || ""
  );

  const [showGallery, setShowGallery] = useState(false);
  const [zoom, setZoom] = useState(1);

  const images = product?.images || [];

  // =========================
  // TOUCH / GESTURE STATE
  // =========================
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const initialDistance = useRef(null);

  // =========================
  // LOCK SCROLL
  // =========================
  useEffect(() => {
    document.body.style.overflow = showGallery ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showGallery]);

  // =========================
  // NAVIGATION
  // =========================
  const nextImage = () => {
    if (!images.length) return;

    const index = images.indexOf(selectedImage);
    const next = (index + 1) % images.length;

    setSelectedImage(images[next]);
    setZoom(1);
  };

  const prevImage = () => {
    if (!images.length) return;

    const index = images.indexOf(selectedImage);
    const prev = (index - 1 + images.length) % images.length;

    setSelectedImage(images[prev]);
    setZoom(1);
  };

  // =========================
  // PINCH ZOOM HELPERS
  // =========================
  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // =========================
  // TOUCH HANDLERS (SWIPE + PINCH)
  // =========================
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }

    if (e.touches.length === 2) {
      initialDistance.current = getDistance(e.touches);
    }
  };

  const handleTouchMove = (e) => {
    // PINCH ZOOM
    if (e.touches.length === 2 && initialDistance.current) {
      const newDistance = getDistance(e.touches);
      const scale = newDistance / initialDistance.current;

      setZoom((prev) => Math.min(4, Math.max(1, prev * scale)));
      initialDistance.current = newDistance;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1) {
      const diffX = e.changedTouches[0].clientX - touchStartX.current;
      const diffY = e.changedTouches[0].clientY - touchStartY.current;

      // SWIPE ONLY IF HORIZONTAL
      if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) prevImage();
        else nextImage();
      }
    }

    initialDistance.current = null;
  };

  // =========================
  // WHEEL ZOOM (DESKTOP)
  // =========================
  const handleWheel = (e) => {
    if (!showGallery) return;

    e.preventDefault();

    setZoom((prev) => {
      const next = prev + (e.deltaY < 0 ? 0.1 : -0.1);
      return Math.min(4, Math.max(1, next));
    });
  };

  // =========================
  // FULLSCREEN
  // =========================
  const gallery =
    showGallery &&
    createPortal(
      <div
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        {/* CLOSE */}
        <button
          onClick={() => setShowGallery(false)}
          className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 text-white z-50"
        >
          <X />
        </button>

        {/* LEFT */}
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-5 text-white z-50"
          >
            <ChevronLeft size={40} />
          </button>
        )}

        {/* RIGHT */}
        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-5 text-white z-50"
          >
            <ChevronRight size={40} />
          </button>
        )}

        {/* IMAGE */}
        <img
          src={selectedImage}
          alt="fullscreen"
          className="max-h-[90vh] max-w-[90vw] object-contain select-none"
          style={{
            transform: `scale(${zoom})`,
            transition: "transform 0.15s ease",
          }}
          draggable={false}
        />
      </div>,
      document.body
    );

  return (
    <>
      <div className="bg-white rounded-[32px] overflow-hidden shadow-lg">

        {/* MAIN IMAGE */}
        <img
          src={selectedImage}
          alt={product?.name}
          className="w-full h-[320px] object-cover cursor-pointer"
          onClick={() => {
            setShowGallery(true);
            setZoom(1);
          }}
        />

        {/* THUMBNAILS */}
        <div className="flex gap-2 p-3 overflow-x-auto">
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setSelectedImage(img)}
              className="w-16 h-16 object-cover rounded-lg cursor-pointer border"
            />
          ))}
        </div>

        {/* CONTENT */}
        <div className="p-5">
          <h2 className="font-bold text-xl">{product?.name}</h2>

          <p className="text-sm text-gray-500">{product?.description}</p>

          <select
            className="w-full mt-3 p-2 border rounded"
            value={selectedVariant?.weight}
            onChange={(e) => {
              const v = product.variants.find(
                (x) => x.weight === e.target.value
              );
              setSelectedVariant(v);
            }}
          >
            {product?.variants?.map((v, i) => (
              <option key={i} value={v.weight}>
                {v.weight}
              </option>
            ))}
          </select>

          <div className="flex justify-between mt-4">
            <span className="text-xl font-bold">
              ₹{selectedVariant?.price}
            </span>

            <span>Stock: {selectedVariant?.stock}</span>
          </div>

          <button
            onClick={() => addToCart(product, selectedVariant)}
            className="w-full mt-4 bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>

      {gallery}
    </>
  );
}
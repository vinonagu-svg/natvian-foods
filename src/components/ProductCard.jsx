import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from "lucide-react";

export default function ProductCard({ product, addToCart }) {
  // -------------------------
  // SAFE VARIANTS (IMPORTANT FIX)
  // -------------------------
  const safeVariants = useMemo(() => {
  return product?.variants?.length
    ? product.variants
    : [
        {
          weight: "Default",
          price: product?.price || 0,
          stock: product?.stock || 0,
        },
      ];
}, [product]);
const prices = safeVariants.map(
  (v) => Number(v.price || 0)
);

const minPrice = Math.min(...prices);

const maxPrice = Math.max(...prices);
const isComingSoon =
  product?.comingSoon === true;
const safeBenefits = useMemo(() => {
  if (Array.isArray(product?.benefits)) {
    return product.benefits;
  }

  if (typeof product?.benefits === "string") {
    return product.benefits
      .split(",")
      .map((b) => b.trim())
      .filter(Boolean);
  }

  return [];
}, [product]);
  const [selectedVariant, setSelectedVariant] = useState(
    safeVariants[0]
  );

  useEffect(() => {
    setSelectedVariant(safeVariants[0]);
  }, [safeVariants]);

  // -------------------------
  // SAFE IMAGES
  // -------------------------
  const fallbackImage = "/placeholder.png";

  const images = useMemo(() => {
    return product?.images?.length
      ? product.images
      : [fallbackImage];
  }, [product]);

  const [selectedImage, setSelectedImage] = useState(
    images[0]
  );

  useEffect(() => {
    setSelectedImage(images[0]);
  }, [images]);

  // -------------------------
  // UI STATE
  // -------------------------
  const [showGallery, setShowGallery] = useState(false);
const [showDetails, setShowDetails] = useState(false);
const [zoom, setZoom] = useState(1);

  // -------------------------
  // TOUCH STATE
  // -------------------------
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const initialDistance = useRef(null);

  // -------------------------
  // SCROLL LOCK
  // -------------------------
  useEffect(() => {
    document.body.style.overflow = showGallery
      ? "hidden"
      : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showGallery]);

  // -------------------------
  // IMAGE NAVIGATION
  // -------------------------
  const nextImage = () => {
    const index = images.indexOf(selectedImage);
    const next = (index + 1) % images.length;
    setSelectedImage(images[next]);
    setZoom(1);
  };

  const prevImage = () => {
    const index = images.indexOf(selectedImage);
    const prev = (index - 1 + images.length) % images.length;
    setSelectedImage(images[prev]);
    setZoom(1);
  };

  // -------------------------
  // PINCH ZOOM
  // -------------------------
  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

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
    if (e.touches.length === 2 && initialDistance.current) {
      const newDistance = getDistance(e.touches);
      const scale = newDistance / initialDistance.current;

      setZoom((prev) =>
        Math.min(4, Math.max(1, prev * scale))
      );

      initialDistance.current = newDistance;
    }
  };

  const handleTouchEnd = (e) => {
    if (e.changedTouches.length === 1) {
      const diffX =
        e.changedTouches[0].clientX - touchStartX.current;
      const diffY =
        e.changedTouches[0].clientY - touchStartY.current;

      if (
        Math.abs(diffX) > 50 &&
        Math.abs(diffX) > Math.abs(diffY)
      ) {
        if (diffX > 0) prevImage();
        else nextImage();
      }
    }

    initialDistance.current = null;
  };

  // -------------------------
  // WHEEL ZOOM
  // -------------------------
  const handleWheel = (e) => {
    if (!showGallery) return;
    e.preventDefault();

    setZoom((prev) => {
      const next = prev + (e.deltaY < 0 ? 0.1 : -0.1);
      return Math.min(4, Math.max(1, next));
    });
  };

  // -------------------------
  // SAFE CART HANDLER (FIXED)
  // -------------------------
  const handleAddToCart = () => {
    const item = {
      id: product?.id,
      name: product?.name,
      tamilName: product?.tamilName,
      image: selectedImage,
      weight: selectedVariant?.weight,
      price: selectedVariant?.price,
      stock: selectedVariant?.stock,
      qty: 1,
    };

    addToCart(product, selectedVariant);
  };

  // -------------------------
  // FULLSCREEN GALLERY
  // -------------------------
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
        <button
          onClick={() => setShowGallery(false)}
          className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/10 text-white"
        >
          <X />
        </button>

        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-5 text-white"
          >
            <ChevronLeft size={40} />
          </button>
        )}

        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-5 text-white"
          >
            <ChevronRight size={40} />
          </button>
        )}

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

  // -------------------------
  // UI
  // -------------------------
  return (
    <>
  <div
  className="
    bg-white
    rounded-[32px]
    overflow-hidden
    shadow-md
    hover:shadow-2xl
    transition-all
    duration-300
    hover:-translate-y-1
    border
    border-[#F1F1F1]
    flex
    flex-col
    h-full
  "
>

        {/* MAIN IMAGE */}

<div className="relative">

  {isComingSoon && (
    <div
      className="
        absolute
        top-3
        right-3
        z-10
        bg-orange-500
        text-white
        px-3
        py-1
        rounded-full
        text-xs
        font-bold
      "
    >
      Coming Soon
    </div>
  )}

  <img
    src={selectedImage}
    alt={product?.name}
    className="
      w-full
      h-[280px]
      object-contain
      bg-[#F8F6F1]
      p-6
      cursor-pointer
    "
    onClick={() => {
      setShowGallery(true);
      setZoom(1);
    }}
  />

</div>

                {/* CONTENT */}
        <div className="p-5 flex-1 flex flex-col">
          <div className="mb-3">
  <span
    className="
      bg-green-100
      text-green-800
      px-3
      py-1
      rounded-full
      text-xs
      font-medium
    "
  >
    🌾 {product?.subcategory}
  </span>
</div>
          <h2 className="font-bold text-xl">
            {product?.name}
          </h2>

          {product?.tamilName && (
            <p className="text-green-700 font-medium">
              {product.tamilName}
            </p>
          )}

          <p className="text-sm text-gray-500 mt-2">
            {product?.description}
          </p>
<div className="mt-3 flex flex-wrap gap-2">
  {safeBenefits.slice(0, 2).map((benefit, i) => (
    <span
      key={i}
      className="
        text-xs
        bg-green-50
        text-green-700
        px-2
        py-1
        rounded-full
      "
    >
      ✓ {benefit}
    </span>
  ))}
</div>
          {/* VARIANT SELECT */}
          <div className="flex gap-2 mt-4 flex-wrap">
  {safeVariants.map((v, i) => (
    <button
      key={i}
      onClick={() => setSelectedVariant(v)}
      className={`
        px-4
        py-2
        rounded-full
        border
        transition

        ${
          selectedVariant?.weight === v.weight
            ? "bg-[#31572C] text-white border-[#31572C]"
            : "bg-white border-gray-300"
        }
      `}
    >
      {v.weight}
    </button>
  ))}
</div>
<div className="mt-auto">
          {/* PRICE */}
          <div className="mt-5">
  <div className="text-3xl font-bold text-[#1D3557]">
    ₹{selectedVariant?.price}
  </div>

  <div className="text-sm text-gray-500 font-medium">
    {selectedVariant?.weight}
  </div>
</div>

          {/* CART BUTTON */}
{isComingSoon ? (
  <button
    disabled
    className="
      w-full
      mt-5
      bg-gray-300
      text-gray-600
      py-4
      rounded-2xl
      cursor-not-allowed
      font-semibold
    "
  >
    Coming Soon
  </button>
) : (
  <button
    onClick={handleAddToCart}
    className="
      w-full
      mt-5
      bg-[#31572C]
      hover:bg-[#264653]
      text-white
      py-4
      rounded-2xl
      flex
      items-center
      justify-center
      gap-2
      transition
    "
  >
    <ShoppingCart size={18} />
    Add to Cart
  </button>
)}
        </div>
        <button
  onClick={() => setShowDetails(true)}
  className="
  w-full
  mt-3
  bg-[#F8F6F1]
  border
  border-[#E8E5DD]
  text-[#31572C]
  font-medium
  py-4
  rounded-2xl
  transition
  hover:bg-[#F1EEE7]
"
>
  View Details
</button>
            </div>
</div>
      {showDetails && (
        <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div
  className="
    bg-white
    rounded-3xl
    max-w-4xl
    w-full
    max-h-[90vh]
    overflow-y-auto
    shadow-2xl
  "
>
            <div className="sticky top-0 bg-white p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold">
                  {product?.name}
                </h2>

                {product?.tamilName && (
                  <p className="text-green-700 text-lg">
                    {product.tamilName}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
  {product?.subcategory}
</p>
              </div>

              <button
                onClick={() => setShowDetails(false)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <X />
              </button>
            </div>

            <img
              src={selectedImage}
              alt={product?.name}
              className="w-full h-[350px] object-cover"
            />

            <div className="p-6 space-y-6">

              <div className="flex gap-3 flex-wrap">
                <span className="bg-green-100 px-3 py-1 rounded-full text-sm">
                  {product?.category}
                </span>

                <span className="bg-orange-100 px-3 py-1 rounded-full text-sm">
                  {product?.subcategory}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">
                  Description
                </h3>

                <p>{product?.description}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">
                  Ingredients
                </h3>

                <p>{product?.ingredients}</p>
              </div>
 {/* Benefits */}
{safeBenefits.length > 0 && (
  <div>
    <h3 className="font-bold text-lg mb-2">
      Benefits
    </h3>

    <ul className="list-disc pl-5 space-y-1">
      {safeBenefits.map((benefit, i) => (
        <li key={i}>{benefit}</li>
      ))}
    </ul>
  </div>
)}
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Usage
                </h3>

                <p>{product?.usage}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold">
                    Shelf Life
                  </h4>

                  <p>{product?.shelfLife}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-semibold">
                    Storage
                  </h4>

                  <p>{product?.storage}</p>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {gallery}
    </>
  );
}
import { useState } from "react";

import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  ShoppingBag,
  Eye,
} from "lucide-react";

export default function ProductCard({
  product,
  addToCart,
}) {

  // =========================
  // STATES
  // =========================

  const [selectedVariant,
    setSelectedVariant] =
    useState(
      product?.variants?.[0]
    );

  const [selectedImage,
    setSelectedImage] =
    useState(
      product?.images?.[0]
    );

  const [showGallery,
    setShowGallery] =
    useState(false);

  const [zoom,
    setZoom] =
    useState(1);

  // =========================
  // NEXT IMAGE
  // =========================

  const nextImage = () => {

    if (!product?.images?.length)
      return;

    const currentIndex =
      product.images.indexOf(
        selectedImage
      );

    const nextIndex =
      (currentIndex + 1) %
      product.images.length;

    setSelectedImage(
      product.images[nextIndex]
    );

    setZoom(1);
  };

  // =========================
  // PREVIOUS IMAGE
  // =========================

  const prevImage = () => {

    if (!product?.images?.length)
      return;

    const currentIndex =
      product.images.indexOf(
        selectedImage
      );

    const prevIndex =
      (
        currentIndex -
        1 +
        product.images.length
      ) %
      product.images.length;

    setSelectedImage(
      product.images[prevIndex]
    );

    setZoom(1);
  };

  return (

    <div
      className="
        group
        relative
        bg-white/90
        backdrop-blur-xl
        rounded-[32px]
        overflow-hidden
        border
        border-gray-100
        shadow-lg
        hover:shadow-2xl
        hover:-translate-y-2
        transition-all
        duration-500
      "
    >

      {/* TOP BADGE */}

      <div
        className="
          absolute
          top-4
          left-4
          z-20
          bg-white/80
          backdrop-blur-md
          px-4
          py-1.5
          rounded-full
          shadow-md
          text-xs
          font-semibold
          text-gray-700
        "
      >
        Premium
      </div>

      {/* IMAGE SECTION */}

      <div
        className="
          relative
          overflow-hidden
          bg-gradient-to-br
          from-gray-100
          to-gray-200
        "
      >

        <img
          src={
            selectedImage ||
            "https://via.placeholder.com/500"
          }
          alt={product?.name}
          onClick={() => {

            setShowGallery(true);

            setZoom(1);
          }}
          className="
            w-full
            h-[320px]
            object-cover
            cursor-pointer
            transition-all
            duration-700
            group-hover:scale-110
          "
        />

        {/* OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/30
            via-transparent
            to-transparent
            opacity-0
            group-hover:opacity-100
            transition
            duration-500
          "
        />

        {/* VIEW BUTTON */}

        <button
          onClick={() => {

            setShowGallery(true);

            setZoom(1);
          }}
          className="
            absolute
            bottom-5
            right-5
            flex
            items-center
            gap-2
            bg-white/20
            backdrop-blur-md
            border
            border-white/30
            text-white
            px-5
            py-2.5
            rounded-full
            opacity-0
            translate-y-5
            group-hover:opacity-100
            group-hover:translate-y-0
            transition-all
            duration-500
          "
        >
          <Eye size={18} />

          View
        </button>

      </div>

      {/* THUMBNAILS */}

      {product?.images?.length > 0 && (

        <div
          className="
            flex
            gap-3
            px-5
            pt-5
            overflow-x-auto
            scrollbar-hide
          "
        >

          {product.images.map(
            (
              image,
              index
            ) => (

              <div
                key={index}
                onClick={() =>
                  setSelectedImage(
                    image
                  )
                }
                className={`
                  relative
                  min-w-[78px]
                  h-[78px]
                  rounded-2xl
                  overflow-hidden
                  cursor-pointer
                  border-2
                  transition-all
                  duration-300

                  ${
                    selectedImage === image
                      ? `
                        border-black
                        scale-105
                        shadow-xl
                      `
                      : `
                        border-transparent
                        opacity-70
                        hover:opacity-100
                      `
                  }
                `}
              >

                <img
                  src={image}
                  alt={`thumb-${index}`}
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />

              </div>
            )
          )}

        </div>
      )}

      {/* CONTENT */}

      <div className="p-6">

        {/* CATEGORY */}

        <p
          className="
            text-xs
            uppercase
            tracking-widest
            text-gray-400
            font-semibold
            mb-2
          "
        >
          {product?.category}
        </p>

        {/* PRODUCT NAME */}

        <h2
          className="
            text-2xl
            font-bold
            text-gray-900
            mb-3
            line-clamp-1
          "
        >
          {product?.name}
        </h2>

        {/* DESCRIPTION */}

        <p
          className="
            text-gray-500
            text-sm
            leading-relaxed
            mb-6
            line-clamp-2
          "
        >
          {product?.description}
        </p>

        {/* VARIANT SELECT */}

        <select
          value={
            selectedVariant?.weight
          }
          onChange={(e) => {

            const variant =
              product?.variants?.find(
                (v) =>
                  v.weight ===
                  e.target.value
              );

            setSelectedVariant(
              variant
            );
          }}
          className="
            w-full
            border
            border-gray-200
            bg-gray-50
            rounded-2xl
            px-4
            py-3.5
            mb-6
            outline-none
            focus:ring-2
            focus:ring-black
            transition
          "
        >

          {product?.variants?.map(
            (
              variant,
              index
            ) => (

              <option
                key={index}
                value={
                  variant.weight
                }
              >
                {variant.weight}
              </option>
            )
          )}

        </select>

        {/* PRICE SECTION */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <p
              className="
                text-xs
                text-gray-400
                mb-1
              "
            >
              Price
            </p>

            <h3
              className="
                text-3xl
                font-black
                text-gray-900
              "
            >
              ₹
              {
                selectedVariant?.price
              }
            </h3>

          </div>

          <div
            className="
              bg-gray-100
              px-4
              py-2
              rounded-2xl
              text-center
            "
          >

            <p
              className="
                text-xs
                text-gray-400
              "
            >
              Stock
            </p>

            <p
              className="
                text-sm
                font-bold
                text-gray-700
              "
            >
              {
                selectedVariant?.stock
              }
            </p>

          </div>

        </div>

        {/* BUTTON */}

        <button
          onClick={() =>
            addToCart(
              product,
              selectedVariant
            )
          }
          disabled={
            selectedVariant?.stock <= 0
          }
          className={`
            w-full
            flex
            items-center
            justify-center
            gap-2
            py-4
            rounded-2xl
            text-white
            font-semibold
            transition-all
            duration-300

            ${
              selectedVariant?.stock <= 0
                ? `
                  bg-gray-400
                  cursor-not-allowed
                `
                : `
                  bg-black
                  hover:bg-gray-900
                  hover:scale-[1.02]
                  active:scale-100
                `
            }
          `}
        >

          <ShoppingBag size={20} />

          {
            selectedVariant?.stock <= 0
              ? "Out Of Stock"
              : "Add To Cart"
          }

        </button>

      </div>

      {/* FULLSCREEN GALLERY */}

      {showGallery && (

        <div
          className="
            fixed
            inset-0
            z-50
            bg-black/95
            backdrop-blur-lg
            flex
            items-center
            justify-center
          "
        >

          {/* CLOSE */}

          <button
            onClick={() =>
              setShowGallery(false)
            }
            className="
              absolute
              top-5
              right-5
              z-50
              bg-white/10
              hover:bg-white/20
              p-3
              rounded-full
              text-white
              transition
            "
          >
            <X size={28} />
          </button>

          {/* LEFT */}

          {product?.images?.length >
            1 && (

            <button
              onClick={prevImage}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                z-50
                bg-white/10
                hover:bg-white/20
                p-4
                rounded-full
                text-white
                transition
              "
            >
              <ChevronLeft size={34} />
            </button>
          )}

          {/* RIGHT */}

          {product?.images?.length >
            1 && (

            <button
              onClick={nextImage}
              className="
                absolute
                right-5
                top-1/2
                -translate-y-1/2
                z-50
                bg-white/10
                hover:bg-white/20
                p-4
                rounded-full
                text-white
                transition
              "
            >
              <ChevronRight size={34} />
            </button>
          )}

          {/* ZOOM CONTROLS */}

          <div
            className="
              absolute
              top-5
              left-5
              flex
              gap-3
              z-50
            "
          >

            <button
              onClick={() =>
                setZoom(
                  (prev) =>
                    prev + 0.2
                )
              }
              className="
                bg-white/10
                hover:bg-white/20
                p-3
                rounded-full
                text-white
                transition
              "
            >
              <ZoomIn size={24} />
            </button>

            <button
              onClick={() =>
                setZoom(
                  (prev) =>
                    Math.max(
                      1,
                      prev - 0.2
                    )
                )
              }
              className="
                bg-white/10
                hover:bg-white/20
                p-3
                rounded-full
                text-white
                transition
              "
            >
              <ZoomOut size={24} />
            </button>

          </div>

          {/* MAIN IMAGE */}

          <div
            className="
              w-full
              h-full
              overflow-auto
              flex
              items-center
              justify-center
              p-10
            "
          >

            <img
              src={selectedImage}
              alt="fullscreen"
              style={{
                transform: `scale(${zoom})`,
              }}
              className="
                max-w-full
                max-h-[85vh]
                object-contain
                rounded-3xl
                shadow-2xl
                transition-transform
                duration-300
              "
            />

          </div>

          {/* BOTTOM THUMBNAILS */}

          <div
            className="
              absolute
              bottom-5
              left-1/2
              -translate-x-1/2
              flex
              gap-4
              bg-white/10
              backdrop-blur-xl
              border
              border-white/10
              px-5
              py-3
              rounded-3xl
              overflow-x-auto
              max-w-[92%]
            "
          >

            {product?.images?.map(
              (
                image,
                index
              ) => (

                <div
                  key={index}
                  onClick={() => {

                    setSelectedImage(
                      image
                    );

                    setZoom(1);
                  }}
                  className={`
                    min-w-[80px]
                    h-[80px]
                    rounded-2xl
                    overflow-hidden
                    border-2
                    cursor-pointer
                    transition-all

                    ${
                      selectedImage === image
                        ? `
                          border-white
                          scale-105
                        `
                        : `
                          border-transparent
                          opacity-70
                          hover:opacity-100
                        `
                    }
                  `}
                >

                  <img
                    src={image}
                    alt={`gallery-${index}`}
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}
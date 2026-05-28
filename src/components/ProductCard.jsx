import { useState } from "react";

export default function ProductCard({
  product,
  addToCart,
}) {

  // =========================
  // DEFAULT VARIANT
  // =========================
  const [selectedVariant,
    setSelectedVariant] =
    useState(
      product.variants?.[0]
    );

  // =========================
  // DEFAULT IMAGE
  // =========================
  const [selectedImage,
    setSelectedImage] =
    useState(
      product.images?.[0]
    );

  // =========================
  // FULLSCREEN GALLERY
  // =========================
  const [showGallery,
    setShowGallery] =
    useState(false);

  return (

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      {/* MAIN IMAGE */}

      <div className="overflow-hidden">

        <img
          src={
            selectedImage ||
            "https://via.placeholder.com/500"
          }
          alt={product.name}
          onClick={() =>
            setShowGallery(true)
          }
          className="
            w-full
            h-64
            object-cover
            cursor-pointer
            transition-transform
            duration-300
            hover:scale-110
          "
        />

      </div>

      {/* IMAGE GALLERY */}

      {product.images?.length > 0 && (

        <div className="flex gap-2 p-3 overflow-x-auto">

          {product.images.map(
            (image, index) => (

              <img
                key={index}
                src={image}
                alt={`product-${index}`}
                onClick={() =>
                  setSelectedImage(image)
                }
                className={`
                  w-16
                  h-16
                  object-cover
                  rounded-lg
                  border
                  cursor-pointer
                  transition
                  p-1

                  ${
                    selectedImage === image
                      ? "border-black"
                      : "border-gray-300"
                  }
                `}
              />
            )
          )}

        </div>
      )}

      {/* CONTENT */}

      <div className="p-5">

        {/* PRODUCT NAME */}

        <h2 className="text-2xl font-bold mb-2">
          {product.name}
        </h2>

        {/* DESCRIPTION */}

        <p className="text-gray-600 text-sm mb-4">
          {product.description}
        </p>

        {/* VARIANT SELECT */}

        <select
          className="border p-3 rounded w-full mb-4"
          value={
            selectedVariant?.weight
          }
          onChange={(e) => {

            const variant =
              product.variants.find(
                (v) =>
                  v.weight ===
                  e.target.value
              );

            setSelectedVariant(
              variant
            );
          }}
        >

          {product.variants?.map(
            (variant, index) => (

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

        {/* PRICE & STOCK */}

        <div className="flex items-center justify-between mb-4">

          <p className="text-2xl font-bold text-green-700">
            ₹
            {selectedVariant?.price}
          </p>

          <p className="text-sm text-gray-500">
            Stock:
            {" "}
            {selectedVariant?.stock}
          </p>

        </div>

        {/* ADD TO CART */}

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
          className={`w-full py-3 rounded-xl transition text-white

          ${
            selectedVariant?.stock <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-800"
          }`}
        >
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
            bg-black/90
            z-50
            flex
            items-center
            justify-center
            p-4
          "
        >

          {/* CLOSE BUTTON */}

          <button
            onClick={() =>
              setShowGallery(false)
            }
            className="
              absolute
              top-5
              right-5
              text-white
              text-5xl
              font-bold
              z-50
            "
          >
            ×
          </button>

          {/* LARGE IMAGE */}

          <img
            src={selectedImage}
            alt="Fullscreen"
            className="
              max-w-full
              max-h-[80vh]
              rounded-xl
              object-contain
            "
          />

          {/* THUMBNAILS */}

          <div
            className="
              absolute
              bottom-5
              left-0
              right-0
              flex
              justify-center
              gap-3
              overflow-x-auto
              px-4
            "
          >

            {product.images?.map(
              (
                image,
                index
              ) => (

                <img
                  key={index}
                  src={image}
                  alt={`thumb-${index}`}
                  onClick={() =>
                    setSelectedImage(
                      image
                    )
                  }
                  className={`
                    w-20
                    h-20
                    object-cover
                    rounded-lg
                    border-2
                    cursor-pointer

                    ${
                      selectedImage === image
                        ? "border-white"
                        : "border-gray-500"
                    }
                  `}
                />
              )
            )}

          </div>

        </div>
      )}

    </div>
  );
}
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

  return (

    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

      {/* MAIN IMAGE */}

      <img
        src={
          selectedImage ||
          "https://via.placeholder.com/500"
        }
        alt={product.name}
        className="w-full h-64 object-cover"
      />

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
                className={`w-16 h-16 object-cover rounded-lg border cursor-pointer transition

                ${
                  selectedImage === image
                    ? "border-black"
                    : "border-gray-300"
                }`}
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

    </div>
  );
}
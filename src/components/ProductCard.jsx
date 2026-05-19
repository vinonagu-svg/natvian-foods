import { useState } from "react";

export default function ProductCard({
  product,
  addToCart
}) {

  // ✅ DEFAULT VARIANT
  const defaultVariant =
    product?.variants?.[0] || {
      weight: "100g",
      mrp: 0
    };

  const [selectedVariant, setSelectedVariant] =
    useState(defaultVariant);

  // =========================
  // 🎉 OFFER CONFIG
  // =========================
  const OFFER_CONFIG = {
    name: "Launching Offer",
    type: "PERCENT",
    value: 10,
    isActive: true
  };

  // =========================
  // 💰 OFFER PRICE FUNCTION
  // =========================
  const getOfferPrice = (mrp) => {

    const price =
      Number(mrp) || 0;

    if (!OFFER_CONFIG.isActive) {
      return price;
    }

    if (OFFER_CONFIG.type === "PERCENT") {

      return (
        price -
        (price * OFFER_CONFIG.value) / 100
      );
    }

    if (OFFER_CONFIG.type === "FIXED") {

      return (
        price -
        OFFER_CONFIG.value
      );
    }

    return price;
  };

  // =========================
  // 💰 PRICE VALUES
  // =========================
  const mrp =
    Number(selectedVariant?.mrp) || 0;

  const offerPrice =
    Number(getOfferPrice(mrp)) || 0;

  const discountAmount =
    mrp - offerPrice;

  // =========================
  // 🛒 HANDLE ADD TO CART
  // =========================
  const handleAddToCart = () => {

    const safeVariant = {

      weight:
        selectedVariant?.weight || "100g",

      mrp:
        Number(selectedVariant?.mrp) || 0
    };

    console.log(
      "ADDING TO CART:",
      safeVariant
    );

    addToCart(
      product,
      safeVariant
    );
  };

  return (

    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300">

      {/* IMAGE */}
      <div className="overflow-hidden">

        <img
          src={product.image}
          alt={product.name}
          className="h-72 md:h-80 w-full object-cover hover:scale-105 transition duration-500"
        />

      </div>

      {/* CONTENT */}
      <div className="p-8">

        {/* VARIANT SELECT */}
        <select
          value={selectedVariant.weight}
          onChange={(e) => {

            const variant =
              product.variants.find(
                (v) =>
                  v.weight ===
                  e.target.value
              );

            setSelectedVariant(
              variant || defaultVariant
            );
          }}
          className="w-full border p-3 rounded-2xl mb-6"
        >

          {product?.variants?.map(
            (variant, index) => (

              <option
                key={index}
                value={variant.weight}
              >
                {variant.weight}
              </option>

            )
          )}

        </select>

        {/* PRICE SECTION */}
        <div className="flex items-center justify-between mb-4">

          {/* WEIGHT */}
          <p className="text-sm font-medium bg-[#eef4e7] text-[#31572C] px-4 py-2 rounded-full">

            {selectedVariant.weight}

          </p>

          {/* PRICE */}
          <div className="text-right">

            {/* MRP */}
            <p className="text-gray-400 line-through text-sm">

              ₹{mrp}

            </p>

            {/* OFFER PRICE */}
            <p className="text-3xl font-bold text-[#4F772D]">

              ₹{offerPrice.toFixed(0)}

            </p>

            {/* DISCOUNT */}
            <p className="text-green-600 text-sm font-medium">

              Save ₹
              {discountAmount.toFixed(0)}
              {" "}
              ({OFFER_CONFIG.value}% OFF)

            </p>

          </div>

        </div>

        {/* NAME */}
        <h3 className="text-2xl font-bold text-[#31572C] mb-4">

          {product.name}

        </h3>

        {/* DESCRIPTION */}
        <p className="text-gray-600 leading-relaxed mb-8">

          {product.description}

        </p>

        {/* BUTTONS */}
        <div className="flex gap-4">

          {/* ADD TO CART */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[#4F772D] hover:bg-[#31572C] text-white py-3 rounded-2xl font-semibold transition"
          >

            Add To Cart

          </button>

          {/* WHATSAPP */}
          <a
            href={`https://wa.me/917411498799?text=I want to order ${product.name} (${selectedVariant.weight})`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition text-center"
          >

            WhatsApp

          </a>

        </div>

      </div>

    </div>
  );
}
import { useState, useMemo } from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({
  products = [],
  addToCart,
}) {
  const [search, setSearch] = useState("");


  // SAFE ARRAY
  const safeProducts = Array.isArray(products) ? products : [];

  // FILTER PRODUCTS
  const filteredProducts = useMemo(() => {
  return safeProducts.filter((product) => {
    const searchText = search.toLowerCase();

    return (
      product?.name?.toLowerCase().includes(searchText) ||
      product?.tamilName?.toLowerCase().includes(searchText)
    );
  });
}, [safeProducts, search]);

  // =========================
  // UI
  // =========================
  return (
    <div className="p-4">

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      {/* PRODUCTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product?.id}
              product={product}
              addToCart={addToCart}
            />
          ))
        ) : (
          <p className="text-gray-500 col-span-full text-center">
            No products found
          </p>
        )}
      </div>

    </div>
  );
}
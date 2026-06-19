import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

import AddProduct from "./AddProduct";
import EditProductModal from "./EditProductModal";

export default function ProductList({
  categories,
  subcategories,
  selectedCategory,
  selectedSubcategory,
}) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
/* ================= FETCH PRODUCTS ================= */
const fetchProducts = async () => {
  try {
    const snapshot = await getDocs(
      collection(db, "products")
    );

    const data = snapshot.docs.map((doc) => {
      const product = doc.data();

      return {
        id: doc.id,
        ...product,
        benefits: Array.isArray(product.benefits)
          ? product.benefits
          : product.benefits
          ? String(product.benefits)
              .split(",")
              .map((b) => b.trim())
          : [],
      };
    });

    setProducts(data);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchProducts();
}, []);
  /* ================= DELETE ================= */
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm("Delete Product?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));
      alert("Deleted");
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
const toggleProductStatus = async (product) => {
  try {
    await updateDoc(
      doc(db, "products", product.id),
      {
        isActive: !product.isActive,
      }
    );

    fetchProducts();
  } catch (err) {
    console.error(err);
    alert("Failed to update status");
  }
};
  /* ================= HELPERS ================= */
  const getCategoryName = (id) => {
    return categories.find((c) => c.id === id)?.name || "Unknown";
  };

  const getSubcategoryName = (id) => {
    return subcategories.find((s) => s.id === id)?.name || "None";
  };
const filteredProducts =
  products.filter((product) => {

    const categoryMatch =
      !selectedCategory ||
      product.category ===
        selectedCategory;

    const subcategoryMatch =
      !selectedSubcategory ||
      product.subcategory ===
        selectedSubcategory;

    return (
      categoryMatch &&
      subcategoryMatch
    );
  });
  return (
    <div className="p-6">

      {/* ADD PRODUCT */}
      <AddProduct
  refreshProducts={fetchProducts}
  categories={categories}
  subcategories={subcategories}
/>

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        {filteredProducts.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >

            {/* IMAGE */}
            <img
              src={p.images?.[0] || "https://via.placeholder.com/500"}
              alt={p.name}
              className="w-full h-56 object-cover"
            />

            {/* GALLERY */}
            {p.images?.length > 1 && (
              <div className="flex gap-2 p-3 overflow-x-auto">
                {p.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`product-${index}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                ))}
              </div>
            )}

            {/* CONTENT */}
            <div className="p-5">

              <h2 className="text-2xl font-bold mb-1">
  {p.name}
</h2>
<div className="mb-2">
  <button
  onClick={() => toggleProductStatus(p)}
  className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
    p.isActive
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700"
  }`}
>
  {p.isActive ? "🟢 Active" : "🔴 Inactive"}
</button>
</div>
{p.tamilName && (
  <p className="text-green-700 font-medium mb-2">
    {p.tamilName}
  </p>
)}

<p className="text-gray-600 text-sm mb-4">
  {p.description}
</p>

{p.benefits && (
  <div className="mb-3">
    <h4 className="font-semibold text-sm">
      Benefits
    </h4>

    <ul className="list-disc ml-5 text-sm text-gray-600">
      {(Array.isArray(p.benefits)
        ? p.benefits
        : String(p.benefits).split(",")
      ).map((item, index) => (
        <li key={index}>
          {item.trim()}
        </li>
      ))}
    </ul>
  </div>
)}
{p.ingredients && (
  <p className="text-sm mb-2">
    <span className="font-semibold">
      Ingredients:
    </span>{" "}
    {p.ingredients}
  </p>
)}

{p.usage && (
  <p className="text-sm mb-2">
    <span className="font-semibold">
      Usage:
    </span>{" "}
    {p.usage}
  </p>
)}

{p.shelfLife && (
  <p className="text-sm mb-3">
    <span className="font-semibold">
      Shelf Life:
    </span>{" "}
    {p.shelfLife}
  </p>
)}

              {/* CATEGORY */}
              <p className="mb-1">
  <span className="font-semibold">Category:</span>{" "}
  {p.category || "N/A"}
</p>

              {/* SUBCATEGORY */}
              <p className="mb-3">
  <span className="font-semibold">Subcategory:</span>{" "}
  {p.subcategory || "N/A"}
</p>

              {/* VARIANTS */}
              <div className="space-y-2 mb-4">
                {Array.isArray(p.variants) &&
  p.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-2 rounded"
                  >
                    <span>{variant.weight}</span>
                    <span className="font-bold text-green-700">
                      ₹{variant.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      Stock: {variant.stock}
                    </span>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              <div className="flex gap-4">
                <button
                  onClick={() => setEditingProduct(p)}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl w-full"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(p.id)}
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl w-full"
                >
                  Delete
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>

      {/* EDIT MODAL */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          closeModal={() => setEditingProduct(null)}
          refreshProducts={fetchProducts}
        />
      )}

    </div>
  );
}
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
  categories = [],
  subcategories = [],
  selectedCategory = "",
  selectedSubcategory = "",
}) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);

  /* =========================================================
     FETCH PRODUCTS
  ========================================================= */
  const fetchProducts = async () => {
    try {
      const snapshot = await getDocs(
        collection(db, "products")
      );

      const data = snapshot.docs.map((item) => {
        const product = item.data();

        return {
          id: item.id,
          ...product,

          benefits: Array.isArray(product.benefits)
            ? product.benefits
            : product.benefits
            ? String(product.benefits)
                .split(",")
                .map((b) => b.trim())
                .filter(Boolean)
            : [],

          variants: Array.isArray(product.variants)
            ? product.variants
            : [],

          comboItems: Array.isArray(product.comboItems)
            ? product.comboItems
            : [],
        };
      });

      setProducts(data);
    } catch (err) {
      console.error("Fetch products error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================================================
     DELETE PRODUCT / COMBO
  ========================================================= */
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));

      alert("Product deleted successfully");

      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  /* =========================================================
     ACTIVE / INACTIVE
  ========================================================= */
  const toggleProductStatus = async (product) => {
    try {
      await updateDoc(
        doc(db, "products", product.id),
        {
          isActive: product.isActive === false,
        }
      );

      fetchProducts();
    } catch (err) {
      console.error("Status update error:", err);
      alert("Failed to update status");
    }
  };

  /* =========================================================
     NORMALIZE VALUE
     Helps category/subcategory filtering when the selected
     value is either an ID, object, or name.
  ========================================================= */
  const normalizeValue = (value) => {
    if (!value) return "";

    if (typeof value === "object") {
      return String(
        value.id ||
          value.value ||
          value.categoryId ||
          value.subcategoryId ||
          value.name ||
          ""
      )
        .trim()
        .toLowerCase();
    }

    return String(value).trim().toLowerCase();
  };

  /* =========================================================
     CATEGORY MATCH
  ========================================================= */
  const categoryMatches = (product, selected) => {
    if (!selected) return true;

    const selectedValue = normalizeValue(selected);

    const productCategory = normalizeValue(
      product.category
    );

    const productCategoryId = normalizeValue(
      product.categoryId
    );

    const productCategoryName = normalizeValue(
      product.categoryName
    );

    const categoryObject = categories.find(
      (category) =>
        normalizeValue(category.id) === selectedValue ||
        normalizeValue(category.name) === selectedValue
    );

    if (categoryObject) {
      return (
        productCategory ===
          normalizeValue(categoryObject.id) ||
        productCategory ===
          normalizeValue(categoryObject.name) ||
        productCategoryId ===
          normalizeValue(categoryObject.id) ||
        productCategoryName ===
          normalizeValue(categoryObject.name)
      );
    }

    return (
      productCategory === selectedValue ||
      productCategoryId === selectedValue ||
      productCategoryName === selectedValue
    );
  };

  /* =========================================================
     SUBCATEGORY MATCH
  ========================================================= */
  const subcategoryMatches = (product, selected) => {
    if (!selected) return true;

    const selectedValue = normalizeValue(selected);

    const productSubcategory = normalizeValue(
      product.subcategory
    );

    const productSubcategoryId = normalizeValue(
      product.subcategoryId
    );

    const productSubcategoryName = normalizeValue(
      product.subcategoryName
    );

    const subcategoryObject = subcategories.find(
      (subcategory) =>
        normalizeValue(subcategory.id) === selectedValue ||
        normalizeValue(subcategory.name) === selectedValue
    );

    if (subcategoryObject) {
      return (
        productSubcategory ===
          normalizeValue(subcategoryObject.id) ||
        productSubcategory ===
          normalizeValue(subcategoryObject.name) ||
        productSubcategoryId ===
          normalizeValue(subcategoryObject.id) ||
        productSubcategoryName ===
          normalizeValue(subcategoryObject.name)
      );
    }

    return (
      productSubcategory === selectedValue ||
      productSubcategoryId === selectedValue ||
      productSubcategoryName === selectedValue
    );
  };

  /* =========================================================
     FILTER PRODUCTS
  ========================================================= */
  const filteredProducts = products.filter((product) => {
    return (
      categoryMatches(product, selectedCategory) &&
      subcategoryMatches(product, selectedSubcategory)
    );
  });

  /* =========================================================
     CATEGORY NAME
  ========================================================= */
  const getCategoryName = (product) => {
    if (product.categoryName) {
      return product.categoryName;
    }

    const category = categories.find(
      (c) =>
        c.id === product.category ||
        c.name === product.category
    );

    return category?.name || product.category || "N/A";
  };

  /* =========================================================
     SUBCATEGORY NAME
  ========================================================= */
  const getSubcategoryName = (product) => {
    if (product.subcategoryName) {
      return product.subcategoryName;
    }

    const subcategory = subcategories.find(
      (s) =>
        s.id === product.subcategory ||
        s.name === product.subcategory
    );

    return (
      subcategory?.name ||
      product.subcategory ||
      "N/A"
    );
  };

  /* =========================================================
     CHECK COMBO
     Supports:
       isCombo: true
       type: "combo"
       productType: "combo"
  ========================================================= */
  const isComboProduct = (product) => {
    return (
      product.isCombo === true ||
      product.type === "combo" ||
      product.productType === "combo"
    );
  };

  return (
    <div className="p-6">

      {/* =====================================================
          ADD PRODUCT
      ===================================================== */}
      <AddProduct
        refreshProducts={fetchProducts}
        categories={categories}
        subcategories={subcategories}
      />

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}
      <div className="mt-8 mb-4">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-800">
            {filteredProducts.length}
          </span>{" "}
          product
          {filteredProducts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* =====================================================
          PRODUCT GRID
      ===================================================== */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-10 text-center">
          <p className="text-gray-500 text-lg">
            No products found.
          </p>

          {(selectedCategory ||
            selectedSubcategory) && (
            <p className="text-sm text-gray-400 mt-2">
              Try changing the category or subcategory filter.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">

          {filteredProducts.map((p) => {
            const combo = isComboProduct(p);

            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >

                {/* =================================================
                    IMAGE
                ================================================= */}
                <div className="relative">

                  <img
                    src={
                      p.images?.[0] ||
                      "https://via.placeholder.com/500"
                    }
                    alt={p.name || "Product"}
                    className="w-full h-56 object-cover"
                  />

                  {/* COMBO BADGE */}
                  {combo && (
                    <div className="absolute top-3 left-3">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                        🎁 COMBO PACK
                      </span>
                    </div>
                  )}

                </div>

                {/* =================================================
                    GALLERY
                ================================================= */}
                {p.images?.length > 1 && (
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {p.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${p.name}-${index}`}
                        className="w-16 h-16 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}

                {/* =================================================
                    CONTENT
                ================================================= */}
                <div className="p-5">

                  {/* NAME */}
                  <h2 className="text-2xl font-bold mb-1">
                    {p.name}
                  </h2>

                  {/* TAMIL NAME */}
                  {p.tamilName && (
                    <p className="text-green-700 font-medium mb-2">
                      {p.tamilName}
                    </p>
                  )}

                  {/* STATUS */}
                  <div className="mb-3">
                    <button
                      onClick={() =>
                        toggleProductStatus(p)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                        p.isActive === false
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {p.isActive === false
                        ? "🔴 Inactive"
                        : "🟢 Active"}
                    </button>
                  </div>

                  {/* DESCRIPTION */}
                  {p.description && (
                    <p className="text-gray-600 text-sm mb-4">
                      {p.description}
                    </p>
                  )}

                  {/* =================================================
                      COMBO ITEMS
                  ================================================= */}
                  {combo &&
                    p.comboItems?.length > 0 && (
                      <div className="mb-4 bg-orange-50 rounded-xl p-4">

                        <h4 className="font-bold text-sm mb-3 text-orange-800">
                          🎁 Combo Includes
                        </h4>

                        <div className="space-y-2">
                          {p.comboItems.map(
                            (item, index) => (
                              <div
                                key={index}
                                className="flex justify-between items-center bg-white rounded-lg px-3 py-2"
                              >
                                <span className="text-sm font-medium">
                                  {item.name ||
                                    item.productName ||
                                    `Item ${index + 1}`}
                                </span>

                                {(item.weight ||
                                  item.quantity) && (
                                  <span className="text-xs text-gray-500">
                                    {item.weight ||
                                      item.quantity}
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>

                      </div>
                    )}

                  {/* =================================================
                      BENEFITS
                  ================================================= */}
                  {p.benefits?.length > 0 && (
                    <div className="mb-3">

                      <h4 className="font-semibold text-sm">
                        Benefits
                      </h4>

                      <ul className="list-disc ml-5 text-sm text-gray-600">
                        {p.benefits.map(
                          (item, index) => (
                            <li key={index}>
                              {String(item).trim()}
                            </li>
                          )
                        )}
                      </ul>

                    </div>
                  )}

                  {/* =================================================
                      INGREDIENTS
                  ================================================= */}
                  {p.ingredients && (
                    <p className="text-sm mb-2">
                      <span className="font-semibold">
                        Ingredients:
                      </span>{" "}
                      {p.ingredients}
                    </p>
                  )}

                  {/* =================================================
                      USAGE
                  ================================================= */}
                  {p.usage && (
                    <p className="text-sm mb-2">
                      <span className="font-semibold">
                        Usage:
                      </span>{" "}
                      {p.usage}
                    </p>
                  )}

                  {/* =================================================
                      SHELF LIFE
                  ================================================= */}
                  {p.shelfLife && (
                    <p className="text-sm mb-3">
                      <span className="font-semibold">
                        Shelf Life:
                      </span>{" "}
                      {p.shelfLife}
                    </p>
                  )}

                  {/* =================================================
                      CATEGORY
                  ================================================= */}
                  <p className="mb-1 text-sm">
                    <span className="font-semibold">
                      Category:
                    </span>{" "}
                    {getCategoryName(p)}
                  </p>

                  {/* =================================================
                      SUBCATEGORY
                  ================================================= */}
                  <p className="mb-3 text-sm">
                    <span className="font-semibold">
                      Subcategory:
                    </span>{" "}
                    {getSubcategoryName(p)}
                  </p>

                  {/* =================================================
                      COMBO PRICE
                  ================================================= */}
                  {combo && (
                    <div className="bg-green-50 rounded-xl p-3 mb-4">

                      {p.mrp && (
                        <p className="text-sm text-gray-500">
                          MRP:{" "}
                          <span className="line-through">
                            ₹{p.mrp}
                          </span>
                        </p>
                      )}

                      {p.price && (
                        <p className="text-xl font-bold text-green-700">
                          Combo Price: ₹{p.price}
                        </p>
                      )}

                      {p.discount && (
                        <p className="text-sm text-orange-600 font-semibold">
                          {p.discount}% OFF
                        </p>
                      )}

                    </div>
                  )}

                  {/* =================================================
                      NORMAL PRODUCT VARIANTS
                  ================================================= */}
                  {!combo &&
                    Array.isArray(p.variants) &&
                    p.variants.length > 0 && (
                      <div className="space-y-2 mb-4">

                        {p.variants.map(
                          (variant, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-100 p-2 rounded"
                            >
                              <span>
                                {variant.weight}
                              </span>

                              <span className="font-bold text-green-700">
                                ₹{variant.price}
                              </span>

                              <span className="text-sm text-gray-500">
                                Stock:{" "}
                                {variant.stock ?? 0}
                              </span>
                            </div>
                          )
                        )}

                      </div>
                    )}

                  {/* =================================================
                      COMBO VARIANTS
                      If your combo also has variants
                  ================================================= */}
                  {combo &&
                    Array.isArray(p.variants) &&
                    p.variants.length > 0 && (
                      <div className="space-y-2 mb-4">

                        <h4 className="font-semibold text-sm">
                          Pack Options
                        </h4>

                        {p.variants.map(
                          (variant, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center bg-gray-100 p-2 rounded"
                            >
                              <span>
                                {variant.weight}
                              </span>

                              <span className="font-bold text-green-700">
                                ₹{variant.price}
                              </span>

                              <span className="text-sm text-gray-500">
                                Stock:{" "}
                                {variant.stock ?? 0}
                              </span>
                            </div>
                          )
                        )}

                      </div>
                    )}

                  {/* =================================================
                      ACTIONS
                  ================================================= */}
                  <div className="flex gap-4">

                    <button
                      onClick={() =>
                        setEditingProduct(p)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl w-full"
                    >
                      ✏️ Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteProduct(p.id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl w-full"
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>
              </div>
            );
          })}

        </div>
      )}

      {/* =====================================================
          EDIT MODAL
      ===================================================== */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          closeModal={() =>
            setEditingProduct(null)
          }
          refreshProducts={fetchProducts}
          categories={categories}
          subcategories={subcategories}
        />
      )}

    </div>
  );
}
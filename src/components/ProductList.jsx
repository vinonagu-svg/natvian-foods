import {
  useEffect,
  useState,
} from "react";

import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import { db } from "../firebase";

import AddProduct from "./AddProduct";

import EditProductModal from "./EditProductModal";

export default function ProductList() {

  const [products, setProducts] =
    useState([]);

  const [editingProduct,
    setEditingProduct] =
    useState(null);

  // =========================
  // FETCH PRODUCTS
  // =========================
  const fetchProducts =
    async () => {

      try {

        const snapshot =
          await getDocs(
            collection(
              db,
              "products"
            )
          );

        const data =
          snapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setProducts(data);

      } catch (err) {

        console.error(err);
      }
    };

  useEffect(() => {

    fetchProducts();

  }, []);

  // =========================
  // DELETE PRODUCT
  // =========================
  const deleteProduct =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete Product?"
        );

      if (!confirmDelete) return;

      try {

        await deleteDoc(
          doc(
            db,
            "products",
            id
          )
        );

        alert("Deleted");

        fetchProducts();

      } catch (err) {

        console.error(err);

        alert("Delete failed");
      }
    };

  return (

    <div className="p-6">

      {/* ADD PRODUCT */}

      <AddProduct
        refreshProducts={
          fetchProducts
        }
      />

      {/* PRODUCT GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

        {products.map((p) => (

          <div
            key={p.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >

            {/* PRODUCT IMAGE */}

            <img
              src={
                p.images?.[0] ||
                "https://via.placeholder.com/500"
              }
              alt={p.name}
              className="w-full h-56 object-cover"
            />

            {/* IMAGE GALLERY */}

            {p.images?.length > 1 && (

              <div className="flex gap-2 p-3 overflow-x-auto">

                {p.images.map(
                  (
                    image,
                    index
                  ) => (

                    <img
                      key={index}
                      src={image}
                      alt={`product-${index}`}
                      className="w-16 h-16 object-cover rounded border"
                    />
                  )
                )}

              </div>
            )}

            {/* CONTENT */}

            <div className="p-5">

              {/* PRODUCT NAME */}

              <h2 className="text-2xl font-bold mb-2">
                {p.name}
              </h2>

              {/* DESCRIPTION */}

              <p className="text-gray-600 text-sm mb-4">
                {p.description}
              </p>

              {/* CATEGORY */}

              <p className="mb-2">
                <span className="font-semibold">
                  Category:
                </span>
                {" "}
                {p.category}
              </p>

              {/* VARIANTS */}

              <div className="space-y-2 mb-4">

                {p.variants?.map(
                  (
                    variant,
                    index
                  ) => (

                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-100 p-2 rounded"
                    >

                      <span>
                        {variant.weight}
                      </span>

                      <span className="font-bold text-green-700">
                        ₹
                        {variant.price}
                      </span>

                      <span className="text-sm text-gray-500">
                        Stock:
                        {" "}
                        {variant.stock}
                      </span>

                    </div>
                  )
                )}

              </div>

              {/* ACTION BUTTONS */}

              <div className="flex gap-4">

                <button
                  onClick={() =>
                    setEditingProduct(
                      p
                    )
                  }
                  className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl w-full transition"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteProduct(
                      p.id
                    )
                  }
                  className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-xl w-full transition"
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
          product={
            editingProduct
          }
          closeModal={() =>
            setEditingProduct(
              null
            )
          }
          refreshProducts={
            fetchProducts
          }
        />

      )}

    </div>
  );
}
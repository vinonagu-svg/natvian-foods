import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  getDocs,
  updateDoc,
} from "firebase/firestore";

import * as XLSX from "xlsx";

import { db } from "../../firebase";

export default function Categories() {
  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [order, setOrder] = useState("");

  const [editingId, setEditingId] =
    useState(null);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

        data.sort(
          (a, b) =>
            (a.order || 0) -
            (b.order || 0)
        );

        setCategories(data);
      }
    );

    return () => unsub();
  }, []);

  // ==========================
  // ADD CATEGORY
  // ==========================
  const addCategory = async () => {
    if (!name.trim()) {
      alert("Enter category name");
      return;
    }

    await addDoc(
      collection(db, "categories"),
      {
        name,
        order: Number(order) || 0,
        isActive: true,
        createdAt: Date.now(),
      }
    );

    setName("");
    setOrder("");
  };

  // ==========================
  // EDIT CATEGORY
  // ==========================
  const startEdit = (cat) => {
    setEditingId(cat.id);
    setName(cat.name);
    setOrder(cat.order || "");
  };

  // ==========================
  // UPDATE CATEGORY
  // ==========================
  const updateCategory = async () => {
    if (!editingId) return;

    await updateDoc(
      doc(
        db,
        "categories",
        editingId
      ),
      {
        name,
        order: Number(order) || 0,
      }
    );

    setEditingId(null);
    setName("");
    setOrder("");

    alert("Category Updated");
  };

  // ==========================
  // DELETE CATEGORY
  // ==========================
  const deleteCategory = async (id) => {
    if (
      !window.confirm(
        "Delete category?"
      )
    )
      return;

    await deleteDoc(
      doc(db, "categories", id)
    );
  };

  // ==========================
  // EXPORT ALL DATA
  // ==========================
  const exportAllData = async () => {
    try {
      const categoriesSnap =
        await getDocs(
          collection(
            db,
            "categories"
          )
        );

      const categoriesData =
        categoriesSnap.docs.map(
          (doc) => ({
            ID: doc.id,
            Name:
              doc.data().name || "",
            Order:
              doc.data().order || 0,
            Active:
              doc.data()
                .isActive ?? true,
          })
        );

      const subcategoriesSnap =
        await getDocs(
          collection(
            db,
            "subcategories"
          )
        );

      const subcategoriesData =
        subcategoriesSnap.docs.map(
          (doc) => ({
            ID: doc.id,
            Name:
              doc.data().name || "",
            Category:
              doc.data()
                .category || "",
            Order:
              doc.data().order || 0,
          })
        );

      const productsSnap =
        await getDocs(
          collection(db, "products")
        );

      const productsData =
        productsSnap.docs.map(
          (doc) => {
            const data =
              doc.data();

            return {
              ID: doc.id,
              Name:
                data.name || "",
              TamilName:
                data.tamilName ||
                "",
              Category:
                data.category ||
                "",
              Subcategory:
                data.subcategory ||
                "",
              Description:
                data.description ||
                "",
              Ingredients:
                data.ingredients ||
                "",
              Usage:
                data.usage || "",
              ShelfLife:
                data.shelfLife ||
                "",
              Benefits:
                Array.isArray(
                  data.benefits
                )
                  ? data.benefits.join(
                      ", "
                    )
                  : "",
              Variants:
                Array.isArray(
                  data.variants
                )
                  ? data.variants
                      .map(
                        (v) =>
                          `${v.weight} | ₹${v.price} | Stock:${v.stock}`
                      )
                      .join(" || ")
                  : "",
              Images:
                Array.isArray(
                  data.images
                )
                  ? data.images.join(
                      " | "
                    )
                  : "",
            };
          }
        );

      const workbook =
        XLSX.utils.book_new();

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          categoriesData
        ),
        "Categories"
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          subcategoriesData
        ),
        "Subcategories"
      );

      XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(
          productsData
        ),
        "Products"
      );

      XLSX.writeFile(
        workbook,
        `Natvian_Export_${
          new Date()
            .toISOString()
            .split("T")[0]
        }.xlsx`
      );

      alert(
        "Excel Export Completed"
      );
    } catch (err) {
      console.error(err);
      alert("Export Failed");
    }
  };

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          Categories
        </h1>

        <button
          onClick={exportAllData}
          className="bg-green-600 text-white px-5 py-2 rounded"
        >
          Export All Data
        </button>
      </div>

      <div className="bg-white p-5 rounded shadow mb-6">
        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Category Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Order"
            value={order}
            onChange={(e) =>
              setOrder(e.target.value)
            }
            className="border p-3 rounded"
          />

        </div>

        {editingId ? (
          <div className="flex gap-3 mt-4">
            <button
              onClick={updateCategory}
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Update Category
            </button>

            <button
              onClick={() => {
                setEditingId(null);
                setName("");
                setOrder("");
              }}
              className="bg-gray-500 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={addCategory}
            className="mt-4 bg-black text-white px-5 py-2 rounded"
          >
            Add Category
          </button>
        )}
      </div>

      <div className="bg-white rounded shadow">
        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Order
              </th>

              <th className="p-3 text-left">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-t"
              >
                <td className="p-3">
                  {cat.name}
                </td>

                <td className="p-3">
                  {cat.order}
                </td>

                <td className="p-3 flex gap-2">

                  <button
                    onClick={() =>
                      startEdit(cat)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      deleteCategory(
                        cat.id
                      )
                    }
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
}
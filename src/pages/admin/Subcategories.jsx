import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function Subcategories() {
  const [categories, setCategories] =
    useState([]);

  const [subcategories, setSubcategories] =
    useState([]);

  const [name, setName] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  // =========================
  // FETCH CATEGORIES
  // =========================
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "categories"),
      (snapshot) => {
        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setCategories(data);
      }
    );

    return () => unsub();
  }, []);

  // =========================
  // FETCH SUBCATEGORIES
  // =========================
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "subcategories"),
      (snapshot) => {
        const data =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setSubcategories(data);
      }
    );

    return () => unsub();
  }, []);

  // =========================
  // ADD SUBCATEGORY
  // =========================
  const addSubcategory =
    async () => {
      if (!name.trim()) {
        alert("Enter subcategory");
        return;
      }

      if (!category) {
        alert("Select category");
        return;
      }

      try {
        await addDoc(
          collection(
            db,
            "subcategories"
          ),
          {
            name,
            category,
            isActive: true,
            createdAt:
              Date.now(),
          }
        );

        setName("");
        setCategory("");

        alert(
          "Subcategory Added"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Failed to create subcategory"
        );
      }
    };

  // =========================
  // START EDIT
  // =========================
  const startEdit = (sub) => {
    setEditingId(sub.id);
    setName(sub.name);
    setCategory(sub.category);
  };

  // =========================
  // UPDATE SUBCATEGORY
  // =========================
  const updateSubcategory =
    async () => {
      if (!editingId) return;

      try {
        await updateDoc(
          doc(
            db,
            "subcategories",
            editingId
          ),
          {
            name,
            category,
          }
        );

        setEditingId(null);
        setName("");
        setCategory("");

        alert(
          "Subcategory Updated"
        );
      } catch (error) {
        console.error(error);

        alert(
          "Update Failed"
        );
      }
    };

  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {
    setEditingId(null);
    setName("");
    setCategory("");
  };

  // =========================
  // DELETE SUBCATEGORY
  // =========================
  const deleteSubcategory =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Delete subcategory?"
        );

      if (!confirmDelete)
        return;

      try {
        await deleteDoc(
          doc(
            db,
            "subcategories",
            id
          )
        );
      } catch (error) {
        console.error(error);

        alert(
          "Delete failed"
        );
      }
    };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">
        Subcategories
      </h1>

      {/* FORM */}
      <div className="bg-white p-5 rounded shadow mb-6">

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Subcategory Name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
            className="border p-3 rounded"
          />

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value
              )
            }
            className="border p-3 rounded"
          >
            <option value="">
              Select Category
            </option>

            {categories.map(
              (cat) => (
                <option
                  key={cat.id}
                  value={cat.name}
                >
                  {cat.name}
                </option>
              )
            )}
          </select>

        </div>

        {editingId ? (
          <div className="flex gap-3 mt-4">

            <button
              onClick={
                updateSubcategory
              }
              className="bg-blue-600 text-white px-5 py-2 rounded"
            >
              Update Subcategory
            </button>

            <button
              onClick={
                cancelEdit
              }
              className="bg-gray-500 text-white px-5 py-2 rounded"
            >
              Cancel
            </button>

          </div>
        ) : (
          <button
            onClick={
              addSubcategory
            }
            className="mt-4 bg-black text-white px-5 py-2 rounded"
          >
            Add Subcategory
          </button>
        )}

      </div>

      {/* LIST */}
      <div className="bg-white rounded shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr>

              <th className="p-3 text-left">
                Name
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {subcategories.map(
              (sub) => (
                <tr
                  key={sub.id}
                  className="border-t"
                >
                  <td className="p-3">
                    {sub.name}
                  </td>

                  <td className="p-3">
                    {sub.category}
                  </td>

                  <td className="p-3 flex gap-2">

                    <button
                      onClick={() =>
                        startEdit(
                          sub
                        )
                      }
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        deleteSubcategory(
                          sub.id
                        )
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              )
            )}

            {subcategories.length ===
              0 && (
              <tr>
                <td
                  colSpan="3"
                  className="p-4 text-center text-gray-500"
                >
                  No subcategories found
                </td>
              </tr>
            )}

          </tbody>

        </table>

      </div>
    </div>
  );
}
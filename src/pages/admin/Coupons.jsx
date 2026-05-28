import { useEffect, useState } from "react";

import AdminSidebar from "../../components/AdminSidebar";

import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  getDocs,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function Coupons() {

  // =========================
  // STATE
  // =========================
  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] =
    useState(false);

  const [form, setForm] =
    useState({
      code: "",
      type: "PERCENT",
      value: 10,
      minCartValue: 0,
      expiryDate: "",
      isActive: true,
    });

  // =========================
  // LIVE FETCH
  // =========================
  useEffect(() => {

    const q = query(
      collection(db, "coupons"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {

        const data =
          snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));

        setCoupons(data);
      }
    );

    return () => unsub();

  }, []);

  // =========================
  // CREATE COUPON
  // =========================
  const createCoupon = async () => {

    try {

      if (!form.code.trim()) {

        alert("Enter coupon code");

        return;
      }

      setLoading(true);

      // CHECK DUPLICATE
      const existing =
        await getDocs(
          collection(db, "coupons")
        );

      const alreadyExists =
        existing.docs.some(
          (d) =>
            d.data().code?.toUpperCase() ===
            form.code.toUpperCase()
        );

      if (alreadyExists) {

        alert("Coupon already exists");

        setLoading(false);

        return;
      }

      // SAFE DATE
      const expiry =
        new Date(
          form.expiryDate +
            "T23:59:59"
        );

      await addDoc(
        collection(db, "coupons"),
        {
          code:
            form.code
              .trim()
              .toUpperCase(),

          type: form.type,

          value:
            Number(form.value),

          minCartValue:
            Number(
              form.minCartValue
            ),

          expiryDate: expiry,

          isActive: true,

          createdAt:
            Date.now(),
        }
      );

      // RESET FORM
      setForm({
        code: "",
        type: "PERCENT",
        value: 10,
        minCartValue: 0,
        expiryDate: "",
        isActive: true,
      });

      alert("Coupon Created ✅");

    } catch (err) {

      console.error(err);

      alert(
        "Failed to create coupon"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // TOGGLE STATUS
  // =========================
  const toggleActive =
    async (id, current) => {

      try {

        await updateDoc(
          doc(db, "coupons", id),
          {
            isActive:
              !current,
          }
        );

      } catch (err) {

        console.error(err);

        alert(
          "Status update failed"
        );
      }
    };

  // =========================
  // DELETE
  // =========================
  const deleteCoupon =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this coupon?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(db, "coupons", id)
        );

      } catch (err) {

        console.error(err);

        alert(
          "Delete failed"
        );
      }
    };

  return (

    <div className="flex">

      <AdminSidebar />

      <div className="ml-64 p-8 w-full min-h-screen bg-gray-100">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-6">
          🎟️ Coupons Admin
        </h1>

        {/* CREATE FORM */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-5">
            Create Coupon
          </h2>

          <div className="grid md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Coupon Code"
              className="border p-3 rounded-xl"
              value={form.code}
              onChange={(e) =>
                setForm({
                  ...form,
                  code:
                    e.target.value,
                })
              }
            />

            <select
              className="border p-3 rounded-xl"
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type:
                    e.target.value,
                })
              }
            >
              <option value="PERCENT">
                PERCENT
              </option>

              <option value="FIXED">
                FIXED
              </option>
            </select>

            <input
              type="number"
              placeholder="Discount Value"
              className="border p-3 rounded-xl"
              value={form.value}
              onChange={(e) =>
                setForm({
                  ...form,
                  value:
                    e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Minimum Cart Value"
              className="border p-3 rounded-xl"
              value={
                form.minCartValue
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  minCartValue:
                    e.target.value,
                })
              }
            />

            <input
              type="date"
              className="border p-3 rounded-xl"
              value={
                form.expiryDate
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  expiryDate:
                    e.target.value,
                })
              }
            />

          </div>

          <button
            onClick={
              createCoupon
            }
            disabled={loading}
            className="mt-5 bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
          >

            {loading
              ? "Creating..."
              : "Create Coupon"}

          </button>

        </div>

        {/* COUPON LIST */}
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {coupons.length === 0 && (

            <div className="bg-white p-6 rounded-2xl shadow">
              No coupons found
            </div>

          )}

          {coupons.map((c) => (

            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl shadow"
            >

              <div className="flex justify-between items-start">

                <div>

                  <h2 className="text-2xl font-bold">
                    {c.code}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    {c.type}
                  </p>

                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    c.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.isActive
                    ? "ACTIVE"
                    : "INACTIVE"}
                </span>

              </div>

              <div className="mt-4 space-y-2 text-sm">

                <p>
                  <strong>
                    Discount:
                  </strong>{" "}
                  {c.type ===
                  "PERCENT"
                    ? `${c.value}%`
                    : `₹${c.value}`}
                </p>

                <p>
                  <strong>
                    Min Cart:
                  </strong>{" "}
                  ₹{c.minCartValue}
                </p>

                <p>
                  <strong>
                    Expiry:
                  </strong>{" "}
                  {c.expiryDate?.toDate
                    ? c.expiryDate
                        .toDate()
                        .toLocaleDateString()
                    : "No Date"}
                </p>

              </div>

              <div className="flex gap-3 mt-5">

                <button
                  onClick={() =>
                    toggleActive(
                      c.id,
                      c.isActive
                    )
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  Toggle
                </button>

                <button
                  onClick={() =>
                    deleteCoupon(
                      c.id
                    )
                  }
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}
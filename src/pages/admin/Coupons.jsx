import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);

  const [form, setForm] = useState({
    code: "",
    type: "PERCENT",
    value: 0,
    minCartValue: 0,
    isActive: true,
    expiryDate: "",
  });

  // =========================
  // FETCH COUPONS
  // =========================
  const fetchCoupons = async () => {
    const snap = await getDocs(collection(db, "coupons"));
    setCoupons(
      snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }))
    );
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  // =========================
  // ADD COUPON
  // =========================
  const addCoupon = async () => {
    if (!form.code) return alert("Enter coupon code");

    await addDoc(collection(db, "coupons"), {
      code: form.code.toUpperCase(),
      type: form.type,
      value: Number(form.value),
      minCartValue: Number(form.minCartValue),
      isActive: form.isActive,
      expiryDate: Timestamp.fromDate(new Date(form.expiryDate)),
    });

    alert("Coupon Added");
    setForm({
      code: "",
      type: "PERCENT",
      value: 0,
      minCartValue: 0,
      isActive: true,
      expiryDate: "",
    });

    fetchCoupons();
  };

  // =========================
  // DELETE
  // =========================
  const deleteCoupon = async (id) => {
    await deleteDoc(doc(db, "coupons", id));
    fetchCoupons();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-8 w-full min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">Coupons</h1>

        {/* CREATE COUPON */}
        <div className="bg-white p-6 rounded shadow mb-6 space-y-3">
          <input
            placeholder="Coupon Code"
            className="border p-2 w-full"
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value })
            }
          />

          <select
            className="border p-2 w-full"
            value={form.type}
            onChange={(e) =>
              setForm({ ...form, type: e.target.value })
            }
          >
            <option value="PERCENT">PERCENT</option>
            <option value="FIXED">FIXED</option>
          </select>

          <input
            type="number"
            placeholder="Value"
            className="border p-2 w-full"
            value={form.value}
            onChange={(e) =>
              setForm({ ...form, value: e.target.value })
            }
          />

          <input
            type="number"
            placeholder="Min Cart Value"
            className="border p-2 w-full"
            value={form.minCartValue}
            onChange={(e) =>
              setForm({ ...form, minCartValue: e.target.value })
            }
          />

          <input
            type="date"
            className="border p-2 w-full"
            value={form.expiryDate}
            onChange={(e) =>
              setForm({ ...form, expiryDate: e.target.value })
            }
          />

          <button
            onClick={addCoupon}
            className="bg-black text-white px-4 py-2 rounded"
          >
            Add Coupon
          </button>
        </div>

        {/* LIST COUPONS */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">
            Active Coupons
          </h2>

          {coupons.map((c) => (
            <div
              key={c.id}
              className="flex justify-between border-b py-3"
            >
              <div>
                <p className="font-bold">{c.code}</p>
                <p className="text-sm text-gray-500">
                  {c.type} | {c.value} | Min ₹{c.minCartValue}
                </p>
              </div>

              <button
                onClick={() => deleteCoupon(c.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
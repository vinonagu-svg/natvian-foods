import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { db } from "../../firebase";

import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "coupons"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setCoupons(data);
    });

    return () => unsub();
  }, []);

  const toggleActive = async (id, current) => {
    await updateDoc(doc(db, "coupons", id), {
      isActive: !current,
    });
  };

  const formatDate = (date) => {
    if (!date) return "-";
    if (date?.toDate) return date.toDate().toLocaleDateString();
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-8 w-full min-h-screen bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">
          🎟️ Coupons
        </h1>

        {coupons.length === 0 ? (
          <p>No coupons found</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="bg-white p-5 rounded-xl shadow">
                <h2 className="text-xl font-bold">{c.code}</h2>

                <p>Type: {c.type}</p>
                <p>Value: {c.value}</p>
                <p>Min Cart: ₹{c.minCartValue}</p>

                <p>Expiry: {formatDate(c.expiryDate)}</p>

                <div
                  className={`mt-2 inline-block px-3 py-1 rounded-full text-sm ${
                    c.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.isActive ? "ACTIVE" : "INACTIVE"}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => toggleActive(c.id, c.isActive)}
                    className="bg-black text-white px-4 py-2 rounded-xl"
                  >
                    Toggle Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
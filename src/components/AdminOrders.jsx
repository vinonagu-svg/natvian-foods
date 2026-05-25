import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

export default function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchOrders =
      async () => {

      try {

        const q = query(
          collection(db, "orders"),
          orderBy(
            "createdAt",
            "desc"
          )
        );

        const querySnapshot =
          await getDocs(q);

        const ordersData =
          querySnapshot.docs.map(
            (doc) => ({
              id: doc.id,
              ...doc.data(),
            })
          );

        setOrders(ordersData);

      } catch (error) {

        console.error(
          "Error fetching orders:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

    fetchOrders();

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Orders...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-8 text-[#31572C]">
        Orders Dashboard
      </h1>

      {orders.length === 0 ? (

        <div className="bg-white p-6 rounded-2xl shadow">
          No Orders Found
        </div>

      ) : (

        <div className="grid gap-6">

          {orders.map((order) => (

            <div
              key={order.id}
              className="bg-white p-6 rounded-2xl shadow"
            >

              <div className="flex justify-between mb-4">

                <h2 className="text-xl font-bold">
                  {order.customerName}
                </h2>

                <span className="text-green-600 font-bold">
                  ₹
                  {order.grandTotal}
                </span>

              </div>

              <p>
                <strong>Phone:</strong>{" "}
                {order.phoneNumber}
              </p>

              <p>
                <strong>Address:</strong>{" "}
                {order.address}
              </p>

              <p>
                <strong>Pincode:</strong>{" "}
                {order.pincode}
              </p>

              <p>
                <strong>State:</strong>{" "}
                {order.state}
              </p>

              <p>
                <strong>Payment:</strong>{" "}
                {order.paymentStatus}
              </p>

              <p>
                <strong>Payment ID:</strong>{" "}
                {order.paymentId}
              </p>

              <div className="mt-4">

                <h3 className="font-bold mb-2">
                  Products
                </h3>

                <div className="space-y-2">

                  {order.products?.map(
                    (
                      product,
                      index
                    ) => (

                      <div
                        key={index}
                        className="border p-3 rounded-xl"
                      >

                        <p>
                          {product.name}
                        </p>

                        <p>
                          {product.weight}
                        </p>

                        <p>
                          Qty:{" "}
                          {product.qty}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}
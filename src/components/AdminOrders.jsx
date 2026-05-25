import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";

export default function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH ORDERS
  // =========================
  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const q = query(
          collection(db, "orders")
        );

        const querySnapshot =
          await getDocs(q);

        const ordersData = [];

        querySnapshot.forEach((doc) => {

          ordersData.push({
            id: doc.id,
            ...doc.data(),
          });
        });

        // Latest first
        ordersData.reverse();

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

  // =========================
  // UI
  // =========================
  return (

    <div className="p-6 max-w-7xl mx-auto">

      <h1 className="text-3xl font-bold mb-8 text-[#31572C]">
        Orders Dashboard
      </h1>

      {loading && (
        <p>Loading orders...</p>
      )}

      {!loading &&
        orders.length === 0 && (
          <p>No orders found.</p>
        )}

      <div className="grid gap-6">

        {orders.map((order) => (

          <div
            key={order.id}
            className="border rounded-2xl p-6 bg-white shadow"
          >

            <div className="flex justify-between items-center mb-4">

              <div>

                <h2 className="text-xl font-bold">
                  {order.customerName}
                </h2>

                <p>
                  {order.phoneNumber}
                </p>

              </div>

              <div className="text-right">

                <p className="font-bold text-green-700">
                  ₹
                  {order.grandTotal?.toFixed(
                    2
                  )}
                </p>

                <p className="text-sm text-gray-500">
                  {order.paymentStatus}
                </p>

              </div>

            </div>

            <div className="mb-4">

              <p>
                <strong>
                  Address:
                </strong>{" "}
                {order.address}
              </p>

              <p>
                <strong>
                  Pincode:
                </strong>{" "}
                {order.pincode}
              </p>

              <p>
                <strong>
                  State:
                </strong>{" "}
                {order.state}
              </p>

            </div>

            <div className="border-t pt-4">

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
                      className="flex justify-between"
                    >

                      <span>
                        {product.name} (
                        {
                          product.weight
                        }
                        ) x{" "}
                        {product.qty}
                      </span>

                      <span>
                        ₹
                        {(
                          Number(
                            product.mrp
                          ) *
                          Number(
                            product.qty
                          )
                        ).toFixed(
                          2
                        )}
                      </span>

                    </div>
                  )
                )}

              </div>

            </div>

            <div className="border-t mt-4 pt-4 grid gap-1">

              <div className="flex justify-between">
                <span>
                  Shipping
                </span>

                <span>
                  ₹
                  {order.shipping?.toFixed(
                    2
                  )}
                </span>
              </div>

              <div className="flex justify-between">
                <span>
                  Discount
                </span>

                <span>
                  ₹
                  {order.couponDiscount?.toFixed(
                    2
                  )}
                </span>
              </div>

              <div className="flex justify-between font-bold text-lg mt-2">
                <span>
                  Grand Total
                </span>

                <span>
                  ₹
                  {order.grandTotal?.toFixed(
                    2
                  )}
                </span>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
import { useEffect, useState } from "react";

import AdminSidebar from "../../components/AdminSidebar";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase";

import {
  Package,
  ShoppingCart,
  IndianRupee,
  TicketPercent,
} from "lucide-react";

export default function Dashboard() {

  // =========================
  // STATE
  // =========================
  const [products, setProducts] =
    useState([]);

  const [orders, setOrders] =
    useState([]);

  const [coupons, setCoupons] =
    useState([]);

  // =========================
  // LIVE PRODUCTS
  // =========================
  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "products"),
      (snap) => {

        const data =
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setProducts(data);
      }
    );

    return () => unsub();

  }, []);

  // =========================
  // LIVE ORDERS
  // =========================
  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "orders"),
      (snap) => {

        const data =
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setOrders(data);
      }
    );

    return () => unsub();

  }, []);

  // =========================
  // LIVE COUPONS
  // =========================
  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "coupons"),
      (snap) => {

        const data =
          snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setCoupons(data);
      }
    );

    return () => unsub();

  }, []);

  // =========================
  // CALCULATIONS
  // =========================
  const totalProducts =
    products.length;

  const totalOrders =
    orders.length;

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.grandTotal || 0
        ),
      0
    );

  const activeCoupons =
    coupons.filter(
      (c) => c.isActive
    ).length;

  const pendingOrders =
    orders.filter(
      (o) =>
        o.orderStatus ===
        "pending"
    ).length;

  // =========================
  // UI
  // =========================
  return (

    <div className="flex">

      <AdminSidebar />

      <div className="ml-64 p-8 w-full min-h-screen bg-gray-100">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-4xl font-bold">
            📊 Admin Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Live store overview
          </p>

        </div>

        {/* TOP CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* PRODUCTS */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Products
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  {totalProducts}
                </h2>

              </div>

              <div className="bg-blue-100 p-4 rounded-2xl">

                <Package
                  size={32}
                />

              </div>

            </div>

          </div>

          {/* ORDERS */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Orders
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  {totalOrders}
                </h2>

              </div>

              <div className="bg-green-100 p-4 rounded-2xl">

                <ShoppingCart
                  size={32}
                />

              </div>

            </div>

          </div>

          {/* REVENUE */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Revenue
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  ₹
                  {totalRevenue.toFixed(
                    2
                  )}
                </h2>

              </div>

              <div className="bg-yellow-100 p-4 rounded-2xl">

                <IndianRupee
                  size={32}
                />

              </div>

            </div>

          </div>

          {/* COUPONS */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <div className="flex justify-between items-center">

              <div>

                <p className="text-gray-500">
                  Active Coupons
                </p>

                <h2 className="text-4xl font-bold mt-3">
                  {activeCoupons}
                </h2>

              </div>

              <div className="bg-purple-100 p-4 rounded-2xl">

                <TicketPercent
                  size={32}
                />

              </div>

            </div>

          </div>

        </div>

        {/* SECOND ROW */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

          {/* RECENT ORDERS */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-bold">
                Recent Orders
              </h2>

              <span className="text-sm text-gray-500">
                Live Updates
              </span>

            </div>

            <div className="space-y-4">

              {orders
                .slice(0, 5)
                .map((order) => (

                  <div
                    key={order.id}
                    className="border rounded-2xl p-4"
                  >

                    <div className="flex justify-between">

                      <div>

                        <h3 className="font-bold">
                          {
                            order.customerName
                          }
                        </h3>

                        <p className="text-sm text-gray-500">
                          {
                            order.orderId
                          }
                        </p>

                      </div>

                      <div className="text-right">

                        <p className="font-bold">
                          ₹
                          {
                            order.grandTotal
                          }
                        </p>

                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.orderStatus ===
                            "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.orderStatus ===
                                "shipped"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {
                            order.orderStatus
                          }
                        </span>

                      </div>

                    </div>

                  </div>

                ))}

              {orders.length === 0 && (

                <p className="text-gray-500">
                  No orders yet
                </p>

              )}

            </div>

          </div>

          {/* QUICK STATS */}
          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-2xl font-bold mb-6">
              Store Summary
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between items-center border-b pb-3">

                <span className="text-gray-600">
                  Pending Orders
                </span>

                <span className="font-bold text-yellow-600">
                  {pendingOrders}
                </span>

              </div>

              <div className="flex justify-between items-center border-b pb-3">

                <span className="text-gray-600">
                  Delivered Orders
                </span>

                <span className="font-bold text-green-600">
                  {
                    orders.filter(
                      (o) =>
                        o.orderStatus ===
                        "delivered"
                    ).length
                  }
                </span>

              </div>

              <div className="flex justify-between items-center border-b pb-3">

                <span className="text-gray-600">
                  Shipped Orders
                </span>

                <span className="font-bold text-blue-600">
                  {
                    orders.filter(
                      (o) =>
                        o.orderStatus ===
                        "shipped"
                    ).length
                  }
                </span>

              </div>

              <div className="flex justify-between items-center">

                <span className="text-gray-600">
                  Avg Order Value
                </span>

                <span className="font-bold">
                  ₹
                  {totalOrders > 0
                    ? (
                        totalRevenue /
                        totalOrders
                      ).toFixed(2)
                    : "0"}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
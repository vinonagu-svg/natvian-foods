import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Analytics() {
  // =========================
  // STATE
  // =========================
  const [orders, setOrders] = useState([]);

  const [filter, setFilter] = useState("ALL");

  // =========================
  // LIVE ORDERS STREAM
  // =========================
  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "orders"),
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(data);
      }
    );

    return () => unsub();
  }, []);

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredOrders = orders.filter((o) => {
    if (filter === "PAID") return o.paymentStatus === "Paid";
    if (filter === "COD") return o.paymentStatus === "COD";
    return true;
  });

  // =========================
  // REVENUE
  // =========================
  const totalRevenue = filteredOrders.reduce(
    (sum, o) => sum + (o.grandTotal || 0),
    0
  );

  const totalOrders = filteredOrders.length;

  // =========================
  // DAILY REVENUE GRAPH
  // =========================
  const revenueMap = {};

  filteredOrders.forEach((o) => {
    const date = new Date(o.createdAt).toLocaleDateString();

    revenueMap[date] =
      (revenueMap[date] || 0) + (o.grandTotal || 0);
  });

  const revenueData = Object.keys(revenueMap).map((date) => ({
    date,
    revenue: revenueMap[date],
  }));

  // =========================
  // TOP PRODUCTS
  // =========================
  const productMap = {};

  filteredOrders.forEach((o) => {
    o.products?.forEach((p) => {
      productMap[p.name] =
        (productMap[p.name] || 0) + (p.qty || 0);
    });
  });

  const topProducts = Object.keys(productMap).map((name) => ({
    name,
    qty: productMap[name],
  }));

  // =========================
  // COUPON USAGE
  // =========================
  const couponMap = {};

  filteredOrders.forEach((o) => {
    const code = o.couponCode || "NO_COUPON";
    couponMap[code] =
      (couponMap[code] || 0) + 1;
  });

  const couponData = Object.keys(couponMap).map((c) => ({
    name: c,
    value: couponMap[c],
  }));

  const COLORS = ["#31572C", "#4CAF50", "#FF9800", "#F44336"];

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-8 w-full min-h-screen bg-gray-100">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-6">
          📊 Analytics Dashboard
        </h1>

        {/* FILTERS */}
        <div className="flex gap-3 mb-6">
          {["ALL", "PAID", "COD"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl font-semibold ${
                filter === f
                  ? "bg-black text-white"
                  : "bg-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p>Total Revenue</p>
            <h2 className="text-3xl font-bold">
              ₹{totalRevenue.toFixed(2)}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p>Total Orders</p>
            <h2 className="text-3xl font-bold">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p>Avg Order Value</p>
            <h2 className="text-3xl font-bold">
              ₹
              {totalOrders
                ? (totalRevenue / totalOrders).toFixed(2)
                : 0}
            </h2>
          </div>

        </div>

        {/* REVENUE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4">
            Revenue Trend
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#31572C" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h2 className="text-xl font-bold mb-4">
            Top Products
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="qty" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* COUPON USAGE */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h2 className="text-xl font-bold mb-4">
            Coupon Usage
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={couponData}
                dataKey="value"
                nameKey="name"
                outerRadius={120}
                label
              >
                {couponData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}
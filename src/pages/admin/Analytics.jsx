import { useEffect, useMemo, useState } from "react";

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
  CartesianGrid,
  Legend,
} from "recharts";

export default function Analytics() {
  // =========================
  // STATE
  // =========================
  const [orders, setOrders] = useState([]);

  const [filter, setFilter] = useState("ALL");

  const [dateFilter, setDateFilter] =
    useState("ALL");

  // =========================
  // LIVE ORDERS
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
  // DATE FILTER
  // =========================
  const isWithinDateRange = (createdAt) => {
    if (dateFilter === "ALL") return true;

    const now = new Date();
    const orderDate = new Date(createdAt);

    const diffDays =
      (now - orderDate) /
      (1000 * 60 * 60 * 24);

    if (dateFilter === "7D")
      return diffDays <= 7;

    if (dateFilter === "30D")
      return diffDays <= 30;

    return true;
  };

  // =========================
  // FILTERED ORDERS
  // =========================
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const paymentMatch =
        filter === "ALL"
          ? true
          : filter === "PAID"
          ? o.paymentStatus === "Paid"
          : o.paymentStatus === "COD";

      return (
        paymentMatch &&
        isWithinDateRange(o.createdAt)
      );
    });
  }, [orders, filter, dateFilter]);

  // =========================
  // STATS
  // =========================
  const totalRevenue =
    filteredOrders.reduce(
      (sum, o) =>
        sum + (o.grandTotal || 0),
      0
    );

  const totalOrders =
    filteredOrders.length;

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

  const totalDiscount =
    filteredOrders.reduce(
      (sum, o) =>
        sum +
        (o.couponDiscount || 0),
      0
    );

  // =========================
  // DAILY REVENUE
  // =========================
  const revenueMap = {};

  filteredOrders.forEach((o) => {
    const date = new Date(
      o.createdAt
    ).toLocaleDateString();

    revenueMap[date] =
      (revenueMap[date] || 0) +
      (o.grandTotal || 0);
  });

  const revenueData =
    Object.keys(revenueMap).map(
      (date) => ({
        date,
        revenue:
          revenueMap[date],
      })
    );

  // =========================
  // TOP PRODUCTS
  // =========================
  const productMap = {};

  filteredOrders.forEach((o) => {
    o.products?.forEach((p) => {
      productMap[p.name] =
        (productMap[p.name] || 0) +
        (p.qty || 0);
    });
  });

  const topProducts =
    Object.keys(productMap)
      .map((name) => ({
        name,
        qty: productMap[name],
      }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 10);

  // =========================
  // COUPON USAGE
  // =========================
  const couponMap = {};

  filteredOrders.forEach((o) => {
    const code =
      o.couponCode ||
      "NO_COUPON";

    couponMap[code] =
      (couponMap[code] || 0) + 1;
  });

  const couponData =
    Object.keys(couponMap).map(
      (c) => ({
        name: c,
        value: couponMap[c],
      })
    );

  // =========================
  // ORDER STATUS
  // =========================
  const statusMap = {
    pending: 0,
    shipped: 0,
    delivered: 0,
  };

  filteredOrders.forEach((o) => {
    const status =
      o.orderStatus || "pending";

    statusMap[status] =
      (statusMap[status] || 0) + 1;
  });

  const statusData = [
    {
      name: "Pending",
      value: statusMap.pending,
    },
    {
      name: "Shipped",
      value: statusMap.shipped,
    },
    {
      name: "Delivered",
      value:
        statusMap.delivered,
    },
  ];

  // =========================
  // COLORS
  // =========================
  const COLORS = [
    "#31572C",
    "#4CAF50",
    "#FF9800",
    "#F44336",
    "#673AB7",
    "#009688",
  ];

  // =========================
  // UI
  // =========================
  return (
    <div className="p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-4xl font-bold">
            📊 Analytics Dashboard
          </h1>

          <div className="flex gap-3">

            {/* PAYMENT FILTER */}
            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
              className="px-4 py-2 rounded-xl border"
            >
              <option value="ALL">
                All Payments
              </option>

              <option value="PAID">
                Paid
              </option>

              <option value="COD">
                COD
              </option>
            </select>

            {/* DATE FILTER */}
            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
              className="px-4 py-2 rounded-xl border"
            >
              <option value="ALL">
                All Time
              </option>

              <option value="7D">
                Last 7 Days
              </option>

              <option value="30D">
                Last 30 Days
              </option>
            </select>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹
              {totalRevenue.toFixed(
                2
              )}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">
              Orders
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">
              Avg Order
            </p>

            <h2 className="text-3xl font-bold mt-2">
              ₹
              {averageOrderValue.toFixed(
                2
              )}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow">
            <p className="text-gray-500">
              Discounts
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-500">
              ₹
              {totalDiscount.toFixed(
                2
              )}
            </h2>
          </div>

        </div>

        {/* REVENUE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Revenue Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <LineChart
              data={revenueData}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="date" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#31572C"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>

        </div>

        {/* TOP PRODUCTS */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">

          <h2 className="text-2xl font-bold mb-4">
            Top Products
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >
            <BarChart
              data={topProducts}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="qty"
                fill="#4CAF50"
              />
            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* PIE CHARTS */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* COUPONS */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-4">
              Coupon Usage
            </h2>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>
                <Pie
                  data={couponData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {couponData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>

          </div>

          {/* ORDER STATUS */}
          <div className="bg-white p-6 rounded-2xl shadow">

            <h2 className="text-2xl font-bold mb-4">
              Order Status
            </h2>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {statusData.map(
                    (
                      entry,
                      index
                    ) => (
                      <Cell
                        key={index}
                        fill={
                          COLORS[
                            index %
                              COLORS.length
                          ]
                        }
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>

          </div>

        </div>

      </div>
   );
}
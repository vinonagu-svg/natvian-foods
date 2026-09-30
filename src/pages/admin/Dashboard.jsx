import { useEffect, useMemo, useState } from "react";
import {
  collection,
  onSnapshot,
} from "firebase/firestore";

import { db } from "../../firebase";

import {
  Package,
  ShoppingCart,
  IndianRupee,
  Clock,
  Truck,
} from "lucide-react";

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [period, setPeriod] = useState("today");

  /* =========================================================
     LOAD PRODUCTS
  ========================================================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(data);
      },
      (error) => {
        console.error("Products listener error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =========================================================
     LOAD ORDERS
  ========================================================= */

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrders(data);
      },
      (error) => {
        console.error("Orders listener error:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  /* =========================================================
     DATE HELPERS
  ========================================================= */

  const getOrderDate = (order) => {
    const value = order?.createdAt;

    if (!value) return null;

    // Firebase Timestamp
    if (typeof value?.toDate === "function") {
      return value.toDate();
    }

    // JavaScript Date
    if (value instanceof Date) {
      return value;
    }

    // Firestore timestamp-like object
    if (value?.seconds) {
      return new Date(value.seconds * 1000);
    }

    // Number / string
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  };

  const startOfDay = (date) => {
    const result = new Date(date);

    result.setHours(0, 0, 0, 0);

    return result;
  };

  const endOfDay = (date) => {
    const result = new Date(date);

    result.setHours(23, 59, 59, 999);

    return result;
  };

  const today = startOfDay(new Date());

  /* =========================================================
     CHECK WORKING DAY
  ========================================================= */

  const isWorkingDay = (date) => {
    const day = date.getDay();

    // Sunday = 0
    // Saturday = 6
    return day !== 0 && day !== 6;
  };

  /* =========================================================
     ADD WORKING DAYS
  ========================================================= */

  const addWorkingDays = (date, workingDays) => {
    const result = new Date(date);

    let daysAdded = 0;

    while (daysAdded < workingDays) {
      result.setDate(result.getDate() + 1);

      if (isWorkingDay(result)) {
        daysAdded++;
      }
    }

    return startOfDay(result);
  };

  /* =========================================================
     WORKING DAYS BETWEEN TWO DATES

     Used for identifying overdue orders.
  ========================================================= */

  const getWorkingDaysBetween = (
    startDate,
    endDate
  ) => {
    const start = startOfDay(startDate);
    const end = startOfDay(endDate);

    if (start >= end) {
      return 0;
    }

    let count = 0;

    const current = new Date(start);

    while (current < end) {
      current.setDate(current.getDate() + 1);

      if (isWorkingDay(current)) {
        count++;
      }
    }

    return count;
  };

  /* =========================================================
     PERIOD START
  ========================================================= */

  const getPeriodStart = () => {
    const date = new Date(today);

    if (period === "7days") {
      date.setDate(date.getDate() - 6);
    }

    if (period === "30days") {
      date.setDate(date.getDate() - 29);
    }

    return startOfDay(date);
  };

  const periodStart = getPeriodStart();

  /* =========================================================
     FILTER ORDERS FOR SELECTED PERIOD
  ========================================================= */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = getOrderDate(order);

      if (!orderDate) return false;

      return (
        orderDate >= periodStart &&
        orderDate <= endOfDay(new Date())
      );
    });
  }, [orders, periodStart.getTime()]);

  /* =========================================================
     TODAY'S ORDERS
  ========================================================= */

  const todayOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDate = getOrderDate(order);

      if (!orderDate) return false;

      return (
        orderDate >= startOfDay(new Date()) &&
        orderDate <= endOfDay(new Date())
      );
    });
  }, [orders]);

  /* =========================================================
     PRODUCT COUNT
  ========================================================= */

  const totalProducts = useMemo(() => {
    return products.filter(
      (product) => product.isActive !== false
    ).length;
  }, [products]);

  /* =========================================================
     TODAY ORDER COUNT
  ========================================================= */

  const todayOrderCount = todayOrders.length;

  /* =========================================================
     TODAY SALES
  ========================================================= */

  const todaySales = useMemo(() => {
    return todayOrders.reduce(
      (total, order) => {
        return (
          total +
          Number(order.grandTotal || 0)
        );
      },
      0
    );
  }, [todayOrders]);

  /* =========================================================
     PENDING ORDERS
  ========================================================= */

  const pendingOrders = useMemo(() => {
    return orders.filter(
      (order) =>
        String(order.orderStatus || "")
          .toLowerCase() === "pending"
    ).length;
  }, [orders]);

  /* =========================================================
     PERIOD SALES
  ========================================================= */

  const periodSales = useMemo(() => {
    return filteredOrders.reduce(
      (total, order) => {
        return (
          total +
          Number(order.grandTotal || 0)
        );
      },
      0
    );
  }, [filteredOrders]);

  /* =========================================================
     DATE-WISE ORDER & SALES SUMMARY
  ========================================================= */

  const dailySummary = useMemo(() => {
    const summary = {};

    filteredOrders.forEach((order) => {
      const date = getOrderDate(order);

      if (!date) return;

      const key =
        date.toLocaleDateString("en-CA");

      if (!summary[key]) {
        summary[key] = {
          date,
          orders: 0,
          sales: 0,
        };
      }

      summary[key].orders += 1;

      summary[key].sales += Number(
        order.grandTotal || 0
      );
    });

    return Object.values(summary).sort(
      (a, b) => b.date - a.date
    );
  }, [filteredOrders]);

  /* =========================================================
     SHIPPING SCHEDULE

     Every order gets a shipping deadline:
     ORDER DATE + 5 WORKING DAYS

     Shows:
     - Overdue
     - Today
     - Next 7 working days

     Excludes:
     - shipped
     - delivered
     - cancelled
     - returned
  ========================================================= */

  const shippingSchedule = useMemo(() => {
    const schedule = {};

    orders.forEach((order) => {
      const orderDate = getOrderDate(order);

      if (!orderDate) return;

      const status = String(
        order.orderStatus || ""
      ).toLowerCase();

      // Orders that no longer need shipping
      if (
        status === "shipped" ||
        status === "delivered" ||
        status === "cancelled" ||
        status === "returned"
      ) {
        return;
      }

      const dueDate = addWorkingDays(
        orderDate,
        5
      );

      /*
       * If the due date is before today,
       * the order is overdue.
       */
      const isOverdue =
        dueDate.getTime() <
        today.getTime();

      /*
       * Find number of working days from today
       * to the due date.
       */
      let workingDaysFromToday = 0;

      if (!isOverdue) {
        workingDaysFromToday =
          getWorkingDaysBetween(
            today,
            dueDate
          );
      }

      /*
       * Only show:
       * - overdue
       * - today
       * - next 7 working days
       */
      if (
        !isOverdue &&
        workingDaysFromToday > 7
      ) {
        return;
      }

      const key = isOverdue
        ? "overdue"
        : dueDate.toLocaleDateString(
            "en-CA"
          );

      if (!schedule[key]) {
        schedule[key] = {
          date: isOverdue
            ? null
            : dueDate,
          orders: [],
          isOverdue,
        };
      }

      schedule[key].orders.push({
        id: order.id,
        orderNumber:
          order.orderNumber ||
          order.id,
        city:
          order.customer?.city ||
          "Unknown",
        state:
          order.customer?.state ||
          "",
        customer:
          order.customer?.name ||
          "-",
        orderDate,
        dueDate,
      });
    });

    /*
     * Sort orders inside each group
     */
    Object.values(schedule).forEach(
      (group) => {
        group.orders.sort(
          (a, b) =>
            a.orderDate - b.orderDate
        );
      }
    );

    /*
     * Convert object to array.
     *
     * Overdue first,
     * then dates in ascending order.
     */
    return Object.values(schedule).sort(
      (a, b) => {
        if (
          a.isOverdue &&
          !b.isOverdue
        ) {
          return -1;
        }

        if (
          !a.isOverdue &&
          b.isOverdue
        ) {
          return 1;
        }

        if (
          a.isOverdue &&
          b.isOverdue
        ) {
          return 0;
        }

        return a.date - b.date;
      }
    );
  }, [orders]);

  /* =========================================================
     TODAY'S ORDER STATUS
  ========================================================= */

  const statusSummary = useMemo(() => {
    const summary = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
    };

    todayOrders.forEach((order) => {
      const status = String(
        order.orderStatus || ""
      ).toLowerCase();

      if (
        summary[status] !== undefined
      ) {
        summary[status] += 1;
      }
    });

    return summary;
  }, [todayOrders]);

  /* =========================================================
     RECENT ORDERS
  ========================================================= */

  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => {
        const dateA =
          getOrderDate(a)?.getTime() || 0;

        const dateB =
          getOrderDate(b)?.getTime() || 0;

        return dateB - dateA;
      })
      .slice(0, 6);
  }, [orders]);

  /* =========================================================
     FORMAT CURRENCY
  ========================================================= */

  const formatCurrency = (amount) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
    })}`;
  };

  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {
    if (!date) return "-";

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  /* =========================================================
     FORMAT SHORT DATE
  ========================================================= */

  const formatShortDate = (date) => {
    if (!date) return "-";

    return date.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
      }
    );
  };

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (date) => {
    if (!date) return "";

    return date.toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     SHIPPING GROUP LABEL
  ========================================================= */

  const getShippingLabel = (group) => {
    if (group.isOverdue) {
      return "Overdue";
    }

    if (
      group.date.getTime() ===
      today.getTime()
    ) {
      return "Today";
    }

    const tomorrow = new Date(today);

    tomorrow.setDate(
      tomorrow.getDate() + 1
    );

    /*
     * If tomorrow is Sunday,
     * next working day is Monday.
     */
    while (!isWorkingDay(tomorrow)) {
      tomorrow.setDate(
        tomorrow.getDate() + 1
      );
    }

    if (
      group.date.getTime() ===
      startOfDay(tomorrow).getTime()
    ) {
      return "Tomorrow";
    }

    return formatShortDate(group.date);
  };

  /* =========================================================
     ORDER STATUS STYLE
  ========================================================= */

  const getStatusClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (value === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (value === "processing") {
      return "bg-blue-100 text-blue-700";
    }

    if (value === "shipped") {
      return "bg-purple-100 text-purple-700";
    }

    if (value === "delivered") {
      return "bg-green-100 text-green-700";
    }

    if (value === "cancelled") {
      return "bg-red-100 text-red-700";
    }

    if (value === "returned") {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  /* =========================================================
     PAYMENT STYLE
  ========================================================= */

  const getPaymentClass = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value === "paid" ||
      value === "success" ||
      value === "successful"
    ) {
      return "bg-green-100 text-green-700";
    }

    if (
      value === "pending" ||
      value === "created"
    ) {
      return "bg-yellow-100 text-yellow-700";
    }

    if (
      value === "failed" ||
      value === "failure"
    ) {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  };

  /* =========================================================
     PAYMENT LABEL
  ========================================================= */

  const getPaymentLabel = (status) => {
    const value = String(
      status || ""
    ).toLowerCase();

    if (
      value === "paid" ||
      value === "success" ||
      value === "successful"
    ) {
      return "Paid";
    }

    if (
      value === "pending" ||
      value === "created"
    ) {
      return "Pending";
    }

    if (
      value === "failed" ||
      value === "failure"
    ) {
      return "Failed";
    }

    if (!status) {
      return "-";
    }

    return String(status);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* =====================================================
          PAGE TITLE
      ===================================================== */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Quick overview of your store
        </p>
      </div>

      {/* =====================================================
          TOP CARDS
      ===================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* PRODUCTS */}

        <div className="bg-white rounded-xl border border-gray-200 p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Products
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {totalProducts}
              </h2>
            </div>

            <div className="p-3 rounded-lg bg-green-50">
              <Package
                size={22}
                className="text-green-600"
              />
            </div>

          </div>

        </div>

        {/* TODAY ORDERS */}

        <div className="bg-white rounded-xl border border-gray-200 p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Today Orders
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {todayOrderCount}
              </h2>
            </div>

            <div className="p-3 rounded-lg bg-blue-50">
              <ShoppingCart
                size={22}
                className="text-blue-600"
              />
            </div>

          </div>

        </div>

        {/* TODAY SALES */}

        <div className="bg-white rounded-xl border border-gray-200 p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Today Sales
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {formatCurrency(todaySales)}
              </h2>
            </div>

            <div className="p-3 rounded-lg bg-purple-50">
              <IndianRupee
                size={22}
                className="text-purple-600"
              />
            </div>

          </div>

        </div>

        {/* PENDING */}

        <div className="bg-white rounded-xl border border-gray-200 p-4">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Pending Orders
              </p>

              <h2 className="text-2xl font-bold text-gray-800 mt-1">
                {pendingOrders}
              </h2>
            </div>

            <div className="p-3 rounded-lg bg-yellow-50">
              <Clock
                size={22}
                className="text-yellow-600"
              />
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          ORDERS & SALES
      ===================================================== */}

      <div className="bg-white rounded-xl border border-gray-200">

        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          <div>

            <h2 className="text-lg font-semibold text-gray-800">
              Orders & Sales
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {filteredOrders.length} orders ·{" "}
              {formatCurrency(periodSales)}
            </p>

          </div>

          <div className="flex bg-gray-100 rounded-lg p-1 w-fit">

            <button
              onClick={() =>
                setPeriod("today")
              }
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                period === "today"
                  ? "bg-white text-gray-800 shadow-sm font-medium"
                  : "text-gray-500"
              }`}
            >
              Today
            </button>

            <button
              onClick={() =>
                setPeriod("7days")
              }
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                period === "7days"
                  ? "bg-white text-gray-800 shadow-sm font-medium"
                  : "text-gray-500"
              }`}
            >
              7 Days
            </button>

            <button
              onClick={() =>
                setPeriod("30days")
              }
              className={`px-3 py-1.5 text-sm rounded-md transition ${
                period === "30days"
                  ? "bg-white text-gray-800 shadow-sm font-medium"
                  : "text-gray-500"
              }`}
            >
              30 Days
            </button>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-gray-100 text-gray-500">

                <th className="text-left px-4 py-3 font-medium">
                  Date
                </th>

                <th className="text-center px-4 py-3 font-medium">
                  Orders
                </th>

                <th className="text-right px-4 py-3 font-medium">
                  Sales
                </th>

              </tr>

            </thead>

            <tbody>

              {dailySummary.length > 0 ? (
                dailySummary.map((item) => (

                  <tr
                    key={item.date.toLocaleDateString(
                      "en-CA"
                    )}
                    className="border-b border-gray-50 last:border-0"
                  >

                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(item.date)}
                    </td>

                    <td className="px-4 py-3 text-center text-gray-700">
                      {item.orders}
                    </td>

                    <td className="px-4 py-3 text-right font-medium text-gray-800">
                      {formatCurrency(
                        item.sales
                      )}
                    </td>

                  </tr>

                ))
              ) : (

                <tr>

                  <td
                    colSpan="3"
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No orders for this period
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =====================================================
          SHIPPING SCHEDULE
      ===================================================== */}

      <div className="bg-white rounded-xl border border-gray-200">

        <div className="p-4 border-b border-gray-200 flex items-center gap-2">

          <Truck
            size={20}
            className="text-gray-600"
          />

          <div>

            <h2 className="text-lg font-semibold text-gray-800">
              Shipping Schedule
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              Orders must be shipped within 5 working days
            </p>

          </div>

        </div>

        <div className="p-4">

          {shippingSchedule.length > 0 ? (

            <div className="space-y-4">

              {shippingSchedule.map(
                (group, groupIndex) => {

                  const label =
                    getShippingLabel(group);

                  const cityCounts = {};

                  group.orders.forEach(
                    (order) => {
                      const key =
                        order.city;

                      if (
                        !cityCounts[key]
                      ) {
                        cityCounts[key] = 0;
                      }

                      cityCounts[key] += 1;
                    }
                  );

                  return (

                    <div
                      key={
                        group.isOverdue
                          ? "overdue"
                          : group.date.toLocaleDateString(
                              "en-CA"
                            )
                      }
                      className={`rounded-lg border p-3 ${
                        group.isOverdue
                          ? "border-red-200 bg-red-50"
                          : group.date.getTime() ===
                            today.getTime()
                          ? "border-orange-200 bg-orange-50"
                          : "border-gray-100 bg-gray-50"
                      }`}
                    >

                      {/* GROUP HEADER */}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">

                        <div className="flex items-center gap-2">

                          <span
                            className={`text-sm font-semibold ${
                              group.isOverdue
                                ? "text-red-700"
                                : group.date.getTime() ===
                                  today.getTime()
                                ? "text-orange-700"
                                : "text-gray-800"
                            }`}
                          >
                            {label}
                          </span>

                          {!group.isOverdue &&
                            group.date.getTime() !==
                              today.getTime() && (

                            <span className="text-xs text-gray-500">
                              {formatDate(
                                group.date
                              )}
                            </span>

                          )}

                        </div>

                        <span
                          className={`text-xs font-medium ${
                            group.isOverdue
                              ? "text-red-700"
                              : "text-gray-500"
                          }`}
                        >
                          {group.orders.length}{" "}
                          {group.orders.length === 1
                            ? "order"
                            : "orders"}
                        </span>

                      </div>

                      {/* CITY SUMMARY */}

                      <div className="flex flex-wrap gap-2 mb-3">

                        {Object.entries(
                          cityCounts
                        ).map(
                          ([city, count]) => (

                            <span
                              key={city}
                              className="px-2 py-1 rounded-md bg-white border border-gray-200 text-xs text-gray-600"
                            >
                              {city}{" "}
                              <span className="font-semibold">
                                {count}
                              </span>
                            </span>

                          )
                        )}

                      </div>

                      {/* ORDERS */}

                      <div className="space-y-2">

                        {group.orders.map(
                          (order) => (

                            <div
                              key={order.id}
                              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-sm"
                            >

                              <div>

                                <span className="font-medium text-gray-800">
                                  {order.orderNumber}
                                </span>

                                <span className="text-gray-500 ml-2">
                                  {order.customer}
                                </span>

                              </div>

                              <div className="text-xs text-gray-500">

                                {order.city}

                                {order.state
                                  ? `, ${order.state}`
                                  : ""}

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    </div>

                  );
                }
              )}

            </div>

          ) : (

            <div className="text-center py-6">

              <Truck
                size={28}
                className="mx-auto text-gray-300 mb-2"
              />

              <p className="text-sm text-gray-400">
                No upcoming shipping orders
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =====================================================
          TODAY'S ORDER STATUS
      ===================================================== */}

      <div className="bg-white rounded-xl border border-gray-200">

        <div className="p-4 border-b border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800">
            Today's Order Status
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            Current status of today's orders
          </p>

        </div>

        <div className="p-4 grid grid-cols-2 md:grid-cols-4 gap-3">

          <div className="rounded-lg bg-yellow-50 p-3">

            <p className="text-xs text-yellow-700">
              Pending
            </p>

            <p className="text-xl font-bold text-yellow-700 mt-1">
              {statusSummary.pending}
            </p>

          </div>

          <div className="rounded-lg bg-blue-50 p-3">

            <p className="text-xs text-blue-700">
              Processing
            </p>

            <p className="text-xl font-bold text-blue-700 mt-1">
              {statusSummary.processing}
            </p>

          </div>

          <div className="rounded-lg bg-purple-50 p-3">

            <p className="text-xs text-purple-700">
              Shipped
            </p>

            <p className="text-xl font-bold text-purple-700 mt-1">
              {statusSummary.shipped}
            </p>

          </div>

          <div className="rounded-lg bg-green-50 p-3">

            <p className="text-xs text-green-700">
              Delivered
            </p>

            <p className="text-xl font-bold text-green-700 mt-1">
              {statusSummary.delivered}
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          RECENT ORDERS
      ===================================================== */}

      <div className="bg-white rounded-xl border border-gray-200">

        <div className="p-4 border-b border-gray-200">

          <h2 className="text-lg font-semibold text-gray-800">
            Recent Orders
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead>

              <tr className="border-b border-gray-100 text-gray-500">

                <th className="text-left px-4 py-3 font-medium">
                  Order
                </th>

                <th className="text-left px-4 py-3 font-medium">
                  Customer
                </th>

                <th className="text-left px-4 py-3 font-medium">
                  Ship To
                </th>

                <th className="text-left px-4 py-3 font-medium">
                  Date
                </th>

                <th className="text-right px-4 py-3 font-medium">
                  Amount
                </th>

                <th className="text-center px-4 py-3 font-medium">
                  Payment
                </th>

                <th className="text-center px-4 py-3 font-medium">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentOrders.length > 0 ? (

                recentOrders.map((order) => {

                  const orderDate =
                    getOrderDate(order);

                  const city =
                    order.customer?.city ||
                    "-";

                  const state =
                    order.customer?.state ||
                    "";

                  const customerName =
                    order.customer?.name ||
                    "-";

                  const paymentStatus =
                    order.paymentStatus || "";

                  const orderStatus =
                    order.orderStatus || "";

                  return (

                    <tr
                      key={order.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50"
                    >

                      {/* ORDER */}

                      <td className="px-4 py-3">

                        <div className="font-medium text-gray-800">
                          {order.orderNumber ||
                            order.id}
                        </div>

                        {orderDate && (

                          <div className="text-xs text-gray-400 mt-0.5">
                            {formatTime(
                              orderDate
                            )}
                          </div>

                        )}

                      </td>

                      {/* CUSTOMER */}

                      <td className="px-4 py-3 text-gray-700">
                        {customerName}
                      </td>

                      {/* SHIP TO */}

                      <td className="px-4 py-3">

                        <div className="text-gray-700">
                          {city}
                        </div>

                        {state && (

                          <div className="text-xs text-gray-400">
                            {state}
                          </div>

                        )}

                      </td>

                      {/* DATE */}

                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {formatDate(
                          orderDate
                        )}
                      </td>

                      {/* AMOUNT */}

                      <td className="px-4 py-3 text-right font-medium text-gray-800 whitespace-nowrap">
                        {formatCurrency(
                          order.grandTotal
                        )}
                      </td>

                      {/* PAYMENT */}

                      <td className="px-4 py-3 text-center">

                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getPaymentClass(
                            paymentStatus
                          )}`}
                        >
                          {getPaymentLabel(
                            paymentStatus
                          )}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-4 py-3 text-center">

                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            orderStatus
                          )}`}
                        >
                          {orderStatus
                            ? orderStatus
                                .charAt(0)
                                .toUpperCase() +
                              orderStatus.slice(1)
                            : "-"}
                        </span>

                      </td>

                    </tr>

                  );
                })

              ) : (

                <tr>

                  <td
                    colSpan="7"
                    className="px-4 py-8 text-center text-gray-400"
                  >
                    No orders yet
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
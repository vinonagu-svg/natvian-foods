import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";

export default function AdminDashboard() {

  // =========================
  // STATES
  // =========================
  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState("");

  const [paymentFilter, setPaymentFilter] =
    useState("ALL");

  // =========================
  // LOAD ORDERS
  // =========================
  useEffect(() => {

    loadOrders();

  }, []);

  const loadOrders = async () => {

    try {

      setLoading(true);

      const q = query(
        collection(db, "orders"),
        orderBy(
          "createdAt",
          "desc"
        )
      );

      const querySnapshot =
        await getDocs(q);

      const loadedOrders =
        querySnapshot.docs.map(
          (doc) => ({

            id: doc.id,

            ...doc.data(),

          })
        );

      setOrders(loadedOrders);

    } catch (error) {

      console.error(error);

      alert(
        "Failed to load orders"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================
  // FILTER ORDERS
  // =========================
  const filteredOrders =
    useMemo(() => {

      return orders.filter(
        (order) => {

          const searchText =
            search.toLowerCase();

          const matchesSearch =

            order.customerName
              ?.toLowerCase()
              .includes(searchText) ||

            order.phoneNumber
              ?.includes(search) ||

            order.state
              ?.toLowerCase()
              .includes(searchText) ||

            order.orderId
              ?.toLowerCase()
              .includes(searchText);

          const matchesDate =
            !selectedDate ||

            order.createdAt
              ?.slice(0, 10) ===
              selectedDate;

          const matchesPayment =

            paymentFilter ===
              "ALL" ||

            order.paymentStatus ===
              paymentFilter;

          return (

            matchesSearch &&
            matchesDate &&
            matchesPayment

          );
        }
      );

    }, [
      orders,
      search,
      selectedDate,
      paymentFilter,
    ]);

  // =========================
  // TOTALS
  // =========================
  const totalOrders =
    filteredOrders.length;

  const totalSales =
    filteredOrders.reduce(
      (sum, order) => {

        return (
          sum +
          Number(
            order.grandTotal || 0
          )
        );

      },
      0
    );

  const paidOrders =
    filteredOrders.filter(
      (o) =>
        o.paymentStatus ===
        "Paid"
    ).length;

  const pendingOrders =
    filteredOrders.filter(
      (o) =>
        o.paymentStatus !==
        "Paid"
    ).length;

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {

    localStorage.removeItem(
      "isAdmin"
    );

    window.location.href =
      "/admin";
  };

  // =========================
  // LOADING UI
  // =========================
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-5"></div>

          <h2 className="text-2xl font-bold">

            Loading Orders...

          </h2>

        </div>

      </div>
    );
  }

  // =========================
  // MAIN UI
  // =========================
  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-10">

          <div>

            <h1 className="text-5xl font-bold text-green-700">

              Natvian Foods

            </h1>

            <p className="text-gray-600 mt-2">

              Admin Dashboard

            </p>

          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold"
          >

            Logout

          </button>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-5 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-gray-500">

              Total Orders

            </p>

            <h2 className="text-4xl font-bold mt-2">

              {totalOrders}

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-gray-500">

              Total Sales

            </p>

            <h2 className="text-4xl font-bold text-green-700 mt-2">

              ₹
              {totalSales.toFixed(2)}

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-gray-500">

              Paid Orders

            </p>

            <h2 className="text-4xl font-bold text-blue-700 mt-2">

              {paidOrders}

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow">

            <p className="text-gray-500">

              Pending

            </p>

            <h2 className="text-4xl font-bold text-yellow-600 mt-2">

              {pendingOrders}

            </h2>

          </div>

        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl p-5 shadow mb-10 grid md:grid-cols-3 gap-4">

          <input
            type="text"
            placeholder="Search customer, phone, state"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border p-4 rounded-2xl"
          />

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="border p-4 rounded-2xl"
          />

          <select
            value={paymentFilter}
            onChange={(e) =>
              setPaymentFilter(
                e.target.value
              )
            }
            className="border p-4 rounded-2xl"
          >

            <option value="ALL">
              All Payments
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

          </select>

        </div>

        {/* EMPTY */}
        {filteredOrders.length ===
        0 ? (

          <div className="bg-white rounded-3xl p-16 shadow text-center">

            <h2 className="text-3xl font-bold mb-3">

              No Orders Found

            </h2>

            <p className="text-gray-500">

              Orders will appear here

            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {filteredOrders.map(
              (order) => (

                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-xl p-8"
                >

                  {/* TOP */}
                  <div className="flex flex-col lg:flex-row justify-between gap-8">

                    {/* LEFT */}
                    <div className="flex-1">

                      <div className="flex items-center gap-4 mb-5">

                        <h2 className="text-3xl font-bold">

                          {
                            order.customerName
                          }

                        </h2>

                        <span
                          className={`px-4 py-2 rounded-full text-sm font-bold ${
                            order.paymentStatus ===
                            "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >

                          {
                            order.paymentStatus
                          }

                        </span>

                      </div>

                      <div className="grid md:grid-cols-2 gap-4">

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-gray-500 text-sm mb-1">

                            Phone

                          </p>

                          <p className="font-bold">

                            {
                              order.phoneNumber
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-gray-500 text-sm mb-1">

                            Order ID

                          </p>

                          <p className="font-bold">

                            {
                              order.orderId
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-gray-500 text-sm mb-1">

                            State

                          </p>

                          <p className="font-bold">

                            {order.state}

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-gray-500 text-sm mb-1">

                            Date

                          </p>

                          <p className="font-bold">

                            {new Date(
                              order.createdAt
                            ).toLocaleString()}

                          </p>

                        </div>

                      </div>

                      {/* ADDRESS */}
                      <div className="bg-gray-50 p-4 rounded-2xl mt-4">

                        <p className="text-gray-500 text-sm mb-1">

                          Address

                        </p>

                        <p className="font-bold">

                          {
                            order.address
                          }

                        </p>

                      </div>

                    </div>

                    {/* TOTAL */}
                    <div className="lg:w-72">

                      <div className="bg-green-50 rounded-3xl p-6">

                        <p className="text-gray-600 mb-2">

                          Grand Total

                        </p>

                        <h2 className="text-5xl font-bold text-green-700">

                          ₹
                          {Number(
                            order.grandTotal || 0
                          ).toFixed(2)}

                        </h2>

                      </div>

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="mt-8">

                    <h3 className="text-2xl font-bold mb-5">

                      Products

                    </h3>

                    <div className="space-y-4">

                      {order.products?.map(
                        (
                          product,
                          index
                        ) => (

                          <div
                            key={index}
                            className="flex justify-between items-center bg-gray-50 rounded-2xl p-4"
                          >

                            <div className="flex items-center gap-4">

                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                className="w-20 h-20 rounded-2xl object-cover"
                              />

                              <div>

                                <h4 className="font-bold text-lg">

                                  {
                                    product.name
                                  }

                                </h4>

                                <p className="text-gray-500">

                                  {
                                    product.weight
                                  }

                                </p>

                              </div>

                            </div>

                            <div className="text-right">

                              <p className="font-bold">

                                Qty:
                                {" "}
                                {
                                  product.qty
                                }

                              </p>

                              <p className="text-green-700 font-bold text-2xl">

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

                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}
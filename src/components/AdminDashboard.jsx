import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
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

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("");

  // =========================
  // LOAD ORDERS FROM FIREBASE
  // =========================
  useEffect(() => {

    fetchOrders();

  }, []);

  // =========================
  // FETCH ORDERS
  // =========================
  const fetchOrders = async () => {

    try {

      const q = query(
        collection(db, "orders"),
        orderBy(
          "createdAt",
          "desc"
        )
      );

      const snapshot =
        await getDocs(q);

      const orderList =
        snapshot.docs.map(
          (docItem) => ({

            firebaseId:
              docItem.id,

            ...docItem.data(),

          })
        );

      setOrders(orderList);

    } catch (error) {

      console.error(
        "Error loading orders:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // TOTAL SALES
  // =========================
  const totalSales =
    useMemo(() => {

      return orders.reduce(
        (sum, order) => {

          return (
            sum +
            Number(
              order.grandTotal ||
              order.total ||
              0
            )
          );

        },
        0
      );

    }, [orders]);

  // =========================
  // TOTAL ORDERS
  // =========================
  const totalOrders =
    orders.length;

  // =========================
  // PAID ORDERS
  // =========================
  const paidOrders =
    orders.filter(
      (order) =>
        order.paymentStatus ===
        "Paid"
    ).length;

  // =========================
  // PENDING ORDERS
  // =========================
  const pendingOrders =
    orders.filter(
      (order) =>
        order.paymentStatus !==
        "Paid"
    ).length;

  // =========================
  // TODAY ORDERS
  // =========================
  const todayOrders =
    orders.filter((order) => {

      if (!order.createdAt)
        return false;

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      const orderDate =
        new Date(
          order.createdAt
        )
          .toISOString()
          .split("T")[0];

      return today === orderDate;

    }).length;

  // =========================
  // FILTER ORDERS
  // =========================
  const filteredOrders =
    orders.filter((order) => {

      const lowerSearch =
        search.toLowerCase();

      const matchesSearch =

        order.customerName
          ?.toLowerCase()
          .includes(
            lowerSearch
          ) ||

        order.phoneNumber
          ?.includes(search) ||

        order.orderId
          ?.toLowerCase()
          .includes(
            lowerSearch
          ) ||

        order.address
          ?.toLowerCase()
          .includes(
            lowerSearch
          ) ||

        order.state
          ?.toLowerCase()
          .includes(
            lowerSearch
          );

      const matchesStatus =

        statusFilter ===
        "All"
          ? true
          : order.paymentStatus ===
            statusFilter;

      const matchesDate =

        !dateFilter
          ? true
          : order.createdAt
              ?.split("T")[0] ===
            dateFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate
      );

    });

  // =========================
  // UPDATE PAYMENT STATUS
  // =========================
  const updatePaymentStatus =
    async (
      firebaseId,
      status
    ) => {

      try {

        await updateDoc(
          doc(
            db,
            "orders",
            firebaseId
          ),
          {
            paymentStatus:
              status,
          }
        );

        const updatedOrders =
          orders.map(
            (order) => {

              if (
                order.firebaseId ===
                firebaseId
              ) {

                return {
                  ...order,
                  paymentStatus:
                    status,
                };
              }

              return order;

            }
          );

        setOrders(
          updatedOrders
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Failed to update payment status"
        );
      }
    };

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder =
    async (firebaseId) => {

      const confirmDelete =
        window.confirm(
          "Delete this order?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(
            db,
            "orders",
            firebaseId
          )
        );

        const updatedOrders =
          orders.filter(
            (order) =>
              order.firebaseId !==
              firebaseId
          );

        setOrders(
          updatedOrders
        );

      } catch (error) {

        console.error(
          error
        );

        alert(
          "Failed to delete order"
        );
      }
    };

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
  // FORMAT DATE
  // =========================
  const formatDate = (
    date
  ) => {

    if (!date)
      return "-";

    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        dateStyle:
          "medium",
        timeStyle:
          "short",
      }
    );
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-5 mb-10">

          <div>

            <h1 className="text-5xl font-bold mb-3">

              Natvian Foods
              Admin

            </h1>

            <p className="text-gray-600 text-lg">

              Orders,
              payments,
              customers &
              sales analytics

            </p>

          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl font-bold"
          >

            Logout

          </button>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-5 gap-5 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-lg border">

            <p className="text-gray-500 mb-2">
              Total Orders
            </p>

            <h2 className="text-4xl font-bold">
              {totalOrders}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border">

            <p className="text-gray-500 mb-2">
              Total Sales
            </p>

            <h2 className="text-4xl font-bold text-green-700">

              ₹
              {totalSales.toFixed(
                2
              )}

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border">

            <p className="text-gray-500 mb-2">
              Paid Orders
            </p>

            <h2 className="text-4xl font-bold text-blue-700">

              {paidOrders}

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border">

            <p className="text-gray-500 mb-2">
              Pending
            </p>

            <h2 className="text-4xl font-bold text-yellow-600">

              {pendingOrders}

            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-lg border">

            <p className="text-gray-500 mb-2">
              Today Orders
            </p>

            <h2 className="text-4xl font-bold text-purple-700">

              {todayOrders}

            </h2>

          </div>

        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl shadow-lg border p-6 mb-10">

          <div className="grid md:grid-cols-3 gap-5">

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search name, phone, state, address, order ID"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="border p-4 rounded-2xl outline-none"
            />

            {/* STATUS */}
            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="border p-4 rounded-2xl outline-none"
            >

              <option value="All">
                All Status
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Pending">
                Pending
              </option>

            </select>

            {/* DATE */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
              className="border p-4 rounded-2xl outline-none"
            />

          </div>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

            <h2 className="text-3xl font-bold">

              Loading Orders...

            </h2>

          </div>

        ) : filteredOrders.length ===
          0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

            <h2 className="text-3xl font-bold mb-3">

              No Orders Found

            </h2>

            <p className="text-gray-500">

              Orders will appear here after customers place orders.

            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {filteredOrders.map(
              (order) => (

                <div
                  key={
                    order.firebaseId
                  }
                  className="bg-white rounded-3xl shadow-xl border p-8"
                >

                  {/* TOP */}
                  <div className="flex flex-col lg:flex-row justify-between gap-8">

                    {/* CUSTOMER */}
                    <div className="flex-1">

                      <h2 className="text-3xl font-bold mb-5">

                        {
                          order.customerName
                        }

                      </h2>

                      <div className="grid md:grid-cols-2 gap-4">

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-sm text-gray-500 mb-1">

                            Phone

                          </p>

                          <p className="font-bold">

                            {
                              order.phoneNumber
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-sm text-gray-500 mb-1">

                            Order ID

                          </p>

                          <p className="font-bold">

                            {
                              order.orderId
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl md:col-span-2">

                          <p className="text-sm text-gray-500 mb-1">

                            Address

                          </p>

                          <p className="font-bold">

                            {
                              order.address
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-sm text-gray-500 mb-1">

                            State

                          </p>

                          <p className="font-bold">

                            {
                              order.state ||
                              "-"
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-sm text-gray-500 mb-1">

                            Pincode

                          </p>

                          <p className="font-bold">

                            {
                              order.pincode
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl md:col-span-2">

                          <p className="text-sm text-gray-500 mb-1">

                            Ordered On

                          </p>

                          <p className="font-bold">

                            {formatDate(
                              order.createdAt
                            )}

                          </p>

                        </div>

                      </div>

                    </div>

                    {/* PAYMENT */}
                    <div className="w-full lg:w-80">

                      <div className="bg-gray-50 rounded-3xl p-6">

                        <h3 className="text-2xl font-bold mb-5">

                          Payment

                        </h3>

                        <div className="mb-6">

                          <span
                            className={`px-5 py-3 rounded-full font-bold ${
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

                        <div className="flex flex-col gap-3">

                          <button
                            onClick={() =>
                              updatePaymentStatus(
                                order.firebaseId,
                                "Paid"
                              )
                            }
                            className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-bold"
                          >

                            Mark Paid

                          </button>

                          <button
                            onClick={() =>
                              updatePaymentStatus(
                                order.firebaseId,
                                "Pending"
                              )
                            }
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-3 rounded-2xl font-bold"
                          >

                            Mark Pending

                          </button>

                          <button
                            onClick={() =>
                              deleteOrder(
                                order.firebaseId
                              )
                            }
                            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-bold"
                          >

                            Delete

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="mt-10 border-t pt-8">

                    <h3 className="text-2xl font-bold mb-6">

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
                            className="flex flex-col md:flex-row justify-between md:items-center gap-5 bg-gray-50 rounded-3xl p-5"
                          >

                            <div className="flex items-center gap-5">

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

                                <h4 className="font-bold text-xl">

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

                              <p className="text-2xl font-bold text-green-700">

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

                  {/* BILL SUMMARY */}
                  <div className="mt-10 border-t pt-8">

                    <div className="grid md:grid-cols-2 gap-5">

                      <div className="bg-gray-50 rounded-2xl p-5">

                        <p className="text-gray-500 mb-2">

                          Total Quantity

                        </p>

                        <h3 className="text-3xl font-bold">

                          {
                            order.totalQuantity ||
                            0
                          }

                        </h3>

                      </div>

                      <div className="bg-gray-50 rounded-2xl p-5">

                        <p className="text-gray-500 mb-2">

                          Shipping

                        </p>

                        <h3 className="text-3xl font-bold">

                          ₹
                          {
                            order.shipping ||
                            0
                          }

                        </h3>

                      </div>

                    </div>

                  </div>

                  {/* TOTAL */}
                  <div className="mt-10 border-t pt-8 flex justify-between items-center">

                    <h3 className="text-2xl font-bold">

                      Grand Total

                    </h3>

                    <h2 className="text-5xl font-bold text-green-700">

                      ₹
                      {Number(
                        order.grandTotal ||
                        order.total ||
                        0
                      ).toFixed(2)}

                    </h2>

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
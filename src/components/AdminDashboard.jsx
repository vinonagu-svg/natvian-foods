import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
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

  const [stateFilter, setStateFilter] =
    useState("All");

  const [dateFilter, setDateFilter] =
    useState("");

  // =========================
  // LOAD ORDERS
  // =========================
  useEffect(() => {

    const q = query(
      collection(db, "orders"),
      orderBy("createdAt", "desc")
    );

    const unsubscribe =
      onSnapshot(
        q,
        (snapshot) => {

          const data =
            snapshot.docs.map(
              (docItem) => ({
                id: docItem.id,
                ...docItem.data(),
              })
            );

          setOrders(data);

          setLoading(false);
        },
        (error) => {

          console.error(error);

          setLoading(false);
        }
      );

    return () => unsubscribe();

  }, []);

  // =========================
  // STATS
  // =========================
  const totalOrders =
    orders.length;

  const totalSales =
    orders.reduce(
      (sum, order) =>

        sum +
        Number(
          order.grandTotal || 0
        ),

      0
    );

  const paidOrders =
    orders.filter(
      (o) =>
        o.paymentStatus ===
        "Paid"
    ).length;

  const pendingOrders =
    orders.filter(
      (o) =>
        o.paymentStatus !==
        "Paid"
    ).length;

  // =========================
  // FILTER
  // =========================
  const filteredOrders =
    useMemo(() => {

      return orders.filter(
        (order) => {

          const searchMatch =

            order.customerName
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            order.phoneNumber
              ?.includes(search) ||

            order.orderId
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              ) ||

            order.address
              ?.toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const statusMatch =
            statusFilter ===
            "All"
              ? true
              : order.paymentStatus ===
                statusFilter;

          const stateMatch =
            stateFilter ===
            "All"
              ? true
              : order.state ===
                stateFilter;

          const dateMatch =
            !dateFilter
              ? true
              : new Date(
                  order.createdAt
                )
                  .toISOString()
                  .split("T")[0] ===
                dateFilter;

          return (
            searchMatch &&
            statusMatch &&
            stateMatch &&
            dateMatch
          );
        }
      );

    }, [
      orders,
      search,
      statusFilter,
      stateFilter,
      dateFilter,
    ]);

  // =========================
  // UPDATE STATUS
  // =========================
  const updatePaymentStatus =
    async (id, status) => {

      try {

        await updateDoc(
          doc(db, "orders", id),
          {
            paymentStatus:
              status,
          }
        );

        alert(
          `Order marked ${status}`
        );

      } catch (error) {

        console.error(error);

        alert(
          "Failed to update order"
        );
      }
    };

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete this order?"
        );

      if (!confirmDelete)
        return;

      try {

        await deleteDoc(
          doc(db, "orders", id)
        );

        alert(
          "Order deleted"
        );

      } catch (error) {

        console.error(error);

        alert(
          "Delete failed"
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
  // LOADING
  // =========================
  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

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
  // UI
  // =========================
  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-10">

          <div>

            <h1 className="text-5xl font-bold text-[#31572C]">

              Natvian Foods Admin

            </h1>

            <p className="text-gray-600 mt-2">

              Orders Management Dashboard

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
        <div className="grid md:grid-cols-4 gap-5 mb-8">

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
              Total Revenue
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
              Pending Orders
            </p>

            <h2 className="text-4xl font-bold text-yellow-600 mt-2">

              {pendingOrders}

            </h2>

          </div>

        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl p-5 shadow mb-8 grid lg:grid-cols-4 gap-4">

          <input
            type="text"
            placeholder="Search name, phone, address"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="border p-4 rounded-2xl"
          />

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border p-4 rounded-2xl"
          >

            <option>
              All
            </option>

            <option>
              Paid
            </option>

            <option>
              Pending
            </option>

          </select>

          <select
            value={stateFilter}
            onChange={(e) =>
              setStateFilter(
                e.target.value
              )
            }
            className="border p-4 rounded-2xl"
          >

            <option>
              All
            </option>

            <option>
              Tamil Nadu
            </option>

            <option>
              Other State
            </option>

          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) =>
              setDateFilter(
                e.target.value
              )
            }
            className="border p-4 rounded-2xl"
          />

        </div>

        {/* EMPTY */}
        {filteredOrders.length ===
        0 ? (

          <div className="bg-white rounded-3xl shadow p-12 text-center">

            <h2 className="text-3xl font-bold">

              No Orders Found

            </h2>

          </div>

        ) : (

          <div className="space-y-6">

            {filteredOrders.map(
              (order) => (

                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow p-8"
                >

                  <div className="flex flex-col lg:flex-row justify-between gap-8">

                    {/* LEFT */}
                    <div className="flex-1">

                      <h2 className="text-3xl font-bold mb-6">

                        {
                          order.customerName
                        }

                      </h2>

                      <div className="grid md:grid-cols-2 gap-4">

                        <InfoBox
                          title="Phone"
                          value={
                            order.phoneNumber
                          }
                        />

                        <InfoBox
                          title="Order ID"
                          value={
                            order.orderId
                          }
                        />

                        <InfoBox
                          title="Address"
                          value={
                            order.address
                          }
                          full
                        />

                        <InfoBox
                          title="State"
                          value={
                            order.state
                          }
                        />

                        <InfoBox
                          title="Date"
                          value={new Date(
                            order.createdAt
                          ).toLocaleString()}
                        />

                      </div>

                    </div>

                    {/* RIGHT */}
                    <div className="w-full lg:w-80">

                      <div className="bg-gray-50 rounded-3xl p-6">

                        <h3 className="text-2xl font-bold mb-5">

                          Payment

                        </h3>

                        <div className="mb-5">

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

                        <div className="space-y-3">

                          <button
                            onClick={() =>
                              updatePaymentStatus(
                                order.id,
                                "Paid"
                              )
                            }
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-bold"
                          >

                            Mark Paid

                          </button>

                          <button
                            onClick={() =>
                              updatePaymentStatus(
                                order.id,
                                "Pending"
                              )
                            }
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-2xl font-bold"
                          >

                            Mark Pending

                          </button>

                          <button
                            onClick={() =>
                              deleteOrder(
                                order.id
                              )
                            }
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-2xl font-bold"
                          >

                            Delete Order

                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="mt-8 border-t pt-6">

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

                            <div className="text-right">

                              <p>
                                Qty:
                                {" "}
                                {
                                  product.qty
                                }
                              </p>

                              <p className="font-bold text-green-700 text-xl">

                                ₹
                                {(
                                  Number(
                                    product.mrp
                                  ) *
                                  Number(
                                    product.qty
                                  )
                                ).toFixed(2)}

                              </p>

                            </div>

                          </div>

                        )
                      )}

                    </div>

                    {/* TOTAL */}
                    <div className="mt-8 border-t pt-6 flex justify-between items-center">

                      <h2 className="text-2xl font-bold">

                        Grand Total

                      </h2>

                      <h2 className="text-4xl font-bold text-green-700">

                        ₹
                        {Number(
                          order.grandTotal || 0
                        ).toFixed(2)}

                      </h2>

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

// =========================
// INFO BOX
// =========================
function InfoBox({
  title,
  value,
  full,
}) {

  return (

    <div
      className={`bg-gray-50 p-4 rounded-2xl ${
        full
          ? "md:col-span-2"
          : ""
      }`}
    >

      <p className="text-gray-500 text-sm mb-1">

        {title}

      </p>

      <p className="font-bold break-words">

        {value || "-"}

      </p>

    </div>
  );
}
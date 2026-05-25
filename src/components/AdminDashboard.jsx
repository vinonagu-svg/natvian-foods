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
  // STATE
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

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  // =========================
  // LIVE FIREBASE ORDERS
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

          const orderList =
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

          setOrders(orderList);

          setLoading(false);
        },

        (error) => {

          console.error(error);

          setLoading(false);
        }
      );

    return () =>
      unsubscribe();

  }, []);

  // =========================
  // TOTALS
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

  const todayOrders =
    orders.filter((order) => {

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      return (
        order.createdAt
          ?.includes(today)
      );
    }).length;

  // =========================
  // FILTERED ORDERS
  // =========================
  const filteredOrders =
    useMemo(() => {

      return orders.filter(
        (order) => {

          const matchesSearch =

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

          const matchesStatus =
            statusFilter ===
              "All" ||
            order.paymentStatus ===
              statusFilter;

          const matchesState =
            stateFilter ===
              "All" ||
            order.state ===
              stateFilter;

          const matchesDate =
            !dateFilter ||
            order.createdAt
              ?.slice(0, 10)
              .includes(
                dateFilter
              );

          return (
            matchesSearch &&
            matchesStatus &&
            matchesState &&
            matchesDate
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
    async (
      id,
      status
    ) => {

      try {

        await updateDoc(
          doc(
            db,
            "orders",
            id
          ),
          {
            paymentStatus:
              status,
          }
        );

      } catch (error) {

        console.error(error);

        alert(
          "Failed to update status"
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
          doc(
            db,
            "orders",
            id
          )
        );

      } catch (error) {

        console.error(error);

        alert(
          "Delete failed"
        );
      }
    };

  // =========================
  // DOWNLOAD CSV
  // =========================
  const downloadCSV = () => {

    const headers = [
      "Order ID",
      "Customer",
      "Phone",
      "State",
      "Amount",
      "Payment",
      "Date",
    ];

    const rows =
      filteredOrders.map(
        (o) => [
          o.orderId,
          o.customerName,
          o.phoneNumber,
          o.state,
          o.grandTotal,
          o.paymentStatus,
          o.createdAt,
        ]
      );

    const csvContent =
      [
        headers.join(","),
        ...rows.map((e) =>
          e.join(",")
        ),
      ].join("\n");

    const blob =
      new Blob(
        [csvContent],
        {
          type:
            "text/csv;charset=utf-8;",
        }
      );

    const link =
      document.createElement(
        "a"
      );

    link.href =
      URL.createObjectURL(
        blob
      );

    link.download =
      "natvian-orders.csv";

    link.click();
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

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="text-center">

          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <p className="text-xl font-bold">
            Loading Orders...
          </p>

        </div>

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-5">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="bg-white rounded-3xl p-6 shadow-lg mb-6">

          <div className="flex flex-col lg:flex-row justify-between gap-5">

            <div>

              <h1 className="text-5xl font-black text-[#31572C]">

                Natvian Foods

              </h1>

              <p className="text-gray-500 mt-2">
                Admin Dashboard
              </p>

            </div>

            <div className="flex gap-3 flex-wrap">

              <button
                onClick={
                  downloadCSV
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl font-bold"
              >

                Export CSV

              </button>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-bold"
              >

                Logout

              </button>

            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-5 gap-5 mb-6">

          <div className="bg-white p-6 rounded-3xl shadow-lg">

            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-4xl font-bold mt-2">

              {totalOrders}

            </h2>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg">

            <p className="text-gray-500">
              Total Sales
            </p>

            <h2 className="text-4xl font-bold text-green-700 mt-2">

              ₹
              {totalSales.toFixed(
                2
              )}

            </h2>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg">

            <p className="text-gray-500">
              Paid Orders
            </p>

            <h2 className="text-4xl font-bold text-blue-700 mt-2">

              {paidOrders}

            </h2>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg">

            <p className="text-gray-500">
              Pending
            </p>

            <h2 className="text-4xl font-bold text-yellow-600 mt-2">

              {pendingOrders}

            </h2>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-lg">

            <p className="text-gray-500">
              Today's Orders
            </p>

            <h2 className="text-4xl font-bold text-purple-700 mt-2">

              {todayOrders}

            </h2>

          </div>

        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl shadow-lg p-5 mb-8">

          <div className="grid lg:grid-cols-4 gap-4">

            <input
              type="text"
              placeholder="Search customer / phone / address"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="border p-4 rounded-2xl"
            />

            <select
              value={
                statusFilter
              }
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="border p-4 rounded-2xl"
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

            <select
              value={
                stateFilter
              }
              onChange={(e) =>
                setStateFilter(
                  e.target.value
                )
              }
              className="border p-4 rounded-2xl"
            >

              <option value="All">
                All States
              </option>

              <option value="Tamil Nadu">
                Tamil Nadu
              </option>

              <option value="Other State">
                Other State
              </option>

            </select>

            <input
              type="date"
              value={
                dateFilter
              }
              onChange={(e) =>
                setDateFilter(
                  e.target.value
                )
              }
              className="border p-4 rounded-2xl"
            />

          </div>

        </div>

        {/* NO ORDERS */}
        {filteredOrders.length ===
        0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-16 text-center">

            <h2 className="text-4xl font-bold mb-3">

              No Orders Found

            </h2>

            <p className="text-gray-500">
              Orders will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {filteredOrders.map(
              (order) => (

                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-lg overflow-hidden"
                >

                  {/* TOP */}
                  <div className="p-6 border-b">

                    <div className="flex flex-col lg:flex-row justify-between gap-6">

                      <div className="grid md:grid-cols-2 gap-4 flex-1">

                        <div>

                          <p className="text-gray-500 text-sm">
                            Customer
                          </p>

                          <h2 className="text-2xl font-bold">

                            {
                              order.customerName
                            }

                          </h2>

                        </div>

                        <div>

                          <p className="text-gray-500 text-sm">
                            Order ID
                          </p>

                          <h2 className="font-bold">

                            {
                              order.orderId
                            }

                          </h2>

                        </div>

                        <div>

                          <p className="text-gray-500 text-sm">
                            Phone
                          </p>

                          <h2 className="font-bold">

                            {
                              order.phoneNumber
                            }

                          </h2>

                        </div>

                        <div>

                          <p className="text-gray-500 text-sm">
                            Date
                          </p>

                          <h2 className="font-bold">

                            {
                              order.createdAt
                            }

                          </h2>

                        </div>

                        <div className="md:col-span-2">

                          <p className="text-gray-500 text-sm">
                            Address
                          </p>

                          <h2 className="font-bold">

                            {
                              order.address
                            }

                          </h2>

                        </div>

                      </div>

                      {/* RIGHT */}
                      <div className="lg:w-80">

                        <div className="bg-gray-50 rounded-3xl p-5">

                          <div className="mb-4">

                            <span
                              className={`px-5 py-2 rounded-full font-bold ${
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

                          <h2 className="text-4xl font-black text-green-700 mb-5">

                            ₹
                            {Number(
                              order.grandTotal || 0
                            ).toFixed(2)}

                          </h2>

                          <div className="space-y-3">

                            <button
                              onClick={() =>
                                setSelectedOrder(
                                  order
                                )
                              }
                              className="w-full bg-black text-white py-3 rounded-2xl font-bold"
                            >

                              View Details

                            </button>

                            <button
                              onClick={() =>
                                updatePaymentStatus(
                                  order.id,
                                  "Paid"
                                )
                              }
                              className="w-full bg-green-600 text-white py-3 rounded-2xl font-bold"
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
                              className="w-full bg-yellow-500 text-white py-3 rounded-2xl font-bold"
                            >

                              Mark Pending

                            </button>

                            <button
                              onClick={() =>
                                deleteOrder(
                                  order.id
                                )
                              }
                              className="w-full bg-red-600 text-white py-3 rounded-2xl font-bold"
                            >

                              Delete

                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="p-6">

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
                            className="bg-gray-50 rounded-2xl p-4 flex flex-col md:flex-row justify-between gap-4"
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

                              <h2 className="text-2xl font-bold text-green-700">

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

                              </h2>

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

        {/* ORDER MODAL */}
        {selectedOrder && (

          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

            <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">

              <div className="flex justify-between items-center mb-6">

                <h2 className="text-3xl font-bold">

                  Order Details

                </h2>

                <button
                  onClick={() =>
                    setSelectedOrder(
                      null
                    )
                  }
                  className="text-3xl"
                >

                  ×

                </button>

              </div>

              <div className="space-y-4">

                <div className="bg-gray-100 p-4 rounded-2xl">

                  <p className="text-gray-500">
                    Customer
                  </p>

                  <h3 className="font-bold text-xl">

                    {
                      selectedOrder.customerName
                    }

                  </h3>

                </div>

                <div className="bg-gray-100 p-4 rounded-2xl">

                  <p className="text-gray-500">
                    Full Address
                  </p>

                  <h3 className="font-bold">

                    {
                      selectedOrder.address
                    }

                  </h3>

                </div>

                <div className="grid md:grid-cols-2 gap-4">

                  <div className="bg-gray-100 p-4 rounded-2xl">

                    <p className="text-gray-500">
                      GST
                    </p>

                    <h3 className="font-bold">

                      ₹
                      {Number(
                        selectedOrder.cgst || 0
                      ).toFixed(2)}

                    </h3>

                  </div>

                  <div className="bg-gray-100 p-4 rounded-2xl">

                    <p className="text-gray-500">
                      Shipping
                    </p>

                    <h3 className="font-bold">

                      ₹
                      {Number(
                        selectedOrder.shipping || 0
                      ).toFixed(2)}

                    </h3>

                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}
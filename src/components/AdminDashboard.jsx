import { useEffect, useMemo, useState } from "react";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function AdminDashboard() {

  // =========================
  // STATES
  // =========================
  const [orders, setOrders] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  // =========================
  // LOAD ORDERS FROM FIREBASE
  // =========================
  const loadOrders = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "orders")
        );

      const ordersData =
        querySnapshot.docs.map(
          (docItem) => ({

            firestoreId:
              docItem.id,

            ...docItem.data(),

          })
        );

      setOrders(ordersData);

    } catch (error) {

      console.error(
        "Error loading orders:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {

    loadOrders();

  }, []);

  // =========================
  // TOTAL SALES
  // =========================
  const totalSales =
    useMemo(() => {

      return orders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.grandTotal || 0
          ),
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
  // FILTER ORDERS
  // =========================
  const filteredOrders =
    orders.filter((order) => {

      return (

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
          )

      );
    });

  // =========================
  // UPDATE PAYMENT STATUS
  // =========================
  const updatePaymentStatus =
    async (
      firestoreId,
      status
    ) => {

      try {

        const orderRef =
          doc(
            db,
            "orders",
            firestoreId
          );

        await updateDoc(
          orderRef,
          {
            paymentStatus:
              status,
          }
        );

        loadOrders();

      } catch (error) {

        console.error(
          "Update failed:",
          error
        );
      }
    };

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder =
    async (
      firestoreId
    ) => {

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
            firestoreId
          )
        );

        loadOrders();

      } catch (error) {

        console.error(
          "Delete failed:",
          error
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

      <div className="min-h-screen flex items-center justify-center text-3xl font-bold">

        Loading Orders...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50 p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-5 mb-10">

          <div>

            <h1 className="text-5xl font-bold mb-3">

              Natvian Foods Admin

            </h1>

            <p className="text-gray-600">

              Manage customer orders & payments

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
        <div className="grid md:grid-cols-4 gap-5 mb-10">

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
              {totalSales.toFixed(2)}

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
              Pending Orders
            </p>

            <h2 className="text-4xl font-bold text-yellow-600">

              {pendingOrders}

            </h2>

          </div>

        </div>

        {/* SEARCH */}
        <div className="bg-white rounded-3xl p-5 shadow-lg border mb-10">

          <input
            type="text"
            placeholder="Search customer, phone or order ID"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl outline-none"
          />

        </div>

        {/* EMPTY */}
        {filteredOrders.length ===
        0 ? (

          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

            <h2 className="text-3xl font-bold mb-3">

              No Orders Found

            </h2>

          </div>

        ) : (

          <div className="space-y-8">

            {filteredOrders
              .slice()
              .reverse()
              .map((order) => (

                <div
                  key={
                    order.firestoreId
                  }
                  className="bg-white rounded-3xl shadow-xl border p-8"
                >

                  {/* CUSTOMER */}
                  <div className="mb-8">

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

                    </div>

                  </div>

                  {/* PRODUCTS */}
                  <div className="space-y-4">

                    {order.products?.map(
                      (
                        product,
                        index
                      ) => (

                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl"
                        >

                          <div>

                            <h3 className="font-bold text-xl">

                              {
                                product.name
                              }

                            </h3>

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

                            <p className="font-bold text-green-700">

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

                  {/* FOOTER */}
                  <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-5">

                    <div>

                      <p className="text-lg">

                        Payment:
                        {" "}

                        <span className="font-bold">

                          {
                            order.paymentStatus
                          }

                        </span>

                      </p>

                      <h2 className="text-4xl font-bold text-green-700 mt-2">

                        ₹
                        {Number(
                          order.grandTotal || 0
                        ).toFixed(2)}

                      </h2>

                    </div>

                    <div className="flex gap-3 flex-wrap">

                      <button
                        onClick={() =>
                          updatePaymentStatus(
                            order.firestoreId,
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
                            order.firestoreId,
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
                            order.firestoreId
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-2xl font-bold"
                      >

                        Delete

                      </button>

                    </div>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}
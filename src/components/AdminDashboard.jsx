import {
  useEffect,
  useMemo,
  useState,
} from "react";

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

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  // =========================
  // LOAD ORDERS FROM FIREBASE
  // =========================
  useEffect(() => {

    loadOrders();

  }, []);

  const loadOrders = async () => {

    try {

      const querySnapshot =
        await getDocs(
          collection(db, "orders")
        );

      const ordersData =
        querySnapshot.docs.map(
          (docItem) => ({

            docId: docItem.id,

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
              order.grandTotal || 0
            )
          );

        },
        0
      );

    }, [orders]);

  // =========================
  // COUNTS
  // =========================
  const totalOrders =
    orders.length;

  const paidOrders =
    orders.filter(
      (order) =>
        order.paymentStatus ===
        "Paid"
    ).length;

  const pendingOrders =
    orders.filter(
      (order) =>
        order.paymentStatus !==
        "Paid"
    ).length;

  // =========================
  // SEARCH FILTER
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
      docId,
      status
    ) => {

      try {

        await updateDoc(
          doc(db, "orders", docId),
          {
            paymentStatus:
              status,
          }
        );

        loadOrders();

      } catch (error) {

        console.error(error);

      }
    };

  // =========================
  // DELETE ORDER
  // =========================
  const deleteOrder =
    async (docId) => {

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
            docId
          )
        );

        loadOrders();

      } catch (error) {

        console.error(error);

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

              Manage orders & payments

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
            placeholder="Search orders..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            className="w-full border p-4 rounded-2xl outline-none"
          />

        </div>

        {/* NO ORDERS */}
        {filteredOrders.length ===
        0 ? (

          <div className="bg-white p-12 rounded-3xl shadow-lg text-center">

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
                  key={order.docId}
                  className="bg-white rounded-3xl shadow-xl border p-8"
                >

                  <div className="flex justify-between items-start flex-col lg:flex-row gap-8">

                    <div className="flex-1">

                      <h2 className="text-3xl font-bold mb-5">

                        {
                          order.customerName
                        }

                      </h2>

                      <div className="space-y-3">

                        <p>
                          <strong>
                            Order ID:
                          </strong>
                          {" "}
                          {
                            order.orderId
                          }
                        </p>

                        <p>
                          <strong>
                            Phone:
                          </strong>
                          {" "}
                          {
                            order.phoneNumber
                          }
                        </p>

                        <p>
                          <strong>
                            Address:
                          </strong>
                          {" "}
                          {
                            order.address
                          }
                        </p>

                        <p>
                          <strong>
                            State:
                          </strong>
                          {" "}
                          {order.state}
                        </p>

                        <p>
                          <strong>
                            Pincode:
                          </strong>
                          {" "}
                          {
                            order.pincode
                          }
                        </p>

                      </div>

                    </div>

                    <div className="w-full lg:w-80">

                      <div className="bg-gray-50 p-6 rounded-3xl">

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

                        <div className="flex flex-col gap-3">

                          <button
                            onClick={() =>
                              updatePaymentStatus(
                                order.docId,
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
                                order.docId,
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
                                order.docId
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
                            className="flex justify-between items-center bg-gray-50 p-5 rounded-3xl"
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

                            </div>

                          </div>

                        )
                      )}

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
                        order.grandTotal || 0
                      ).toFixed(2)}

                    </h2>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}
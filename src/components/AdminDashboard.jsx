import { useEffect, useMemo, useState } from "react";

export default function AdminDashboard() {

  // =========================
  // 📦 ORDERS STATE
  // =========================
  const [orders, setOrders] =
    useState([]);

  // =========================
  // 🔍 SEARCH
  // =========================
  const [search, setSearch] =
    useState("");

  // =========================
  // 📥 LOAD ORDERS
  // =========================
  useEffect(() => {

    try {

      const savedOrders =
        JSON.parse(
          localStorage.getItem(
            "orders"
          )
        ) || [];

      setOrders(savedOrders);

    } catch (error) {

      console.error(
        "Failed to load orders",
        error
      );

      setOrders([]);
    }

  }, []);

  // =========================
  // 💰 TOTAL SALES
  // =========================
  const totalSales =
    useMemo(() => {

      return orders.reduce(
        (sum, order) => {

          return (
            sum +
            Number(order.total || 0)
          );

        },
        0
      );

    }, [orders]);

  // =========================
  // 📦 TOTAL ORDERS
  // =========================
  const totalOrders =
    orders.length;

  // =========================
  // 💳 PAID ORDERS
  // =========================
  const paidOrders =
    orders.filter(
      (order) =>
        order.paymentStatus ===
        "Paid"
    ).length;

  // =========================
  // ⏳ PENDING ORDERS
  // =========================
  const pendingOrders =
    orders.filter(
      (order) =>
        order.paymentStatus !==
        "Paid"
    ).length;

  // =========================
  // 🔎 FILTER ORDERS
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

        order.id
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )

      );

    });

  // =========================
  // ✅ UPDATE PAYMENT STATUS
  // =========================
  const updatePaymentStatus = (
    id,
    status
  ) => {

    const updatedOrders =
      orders.map((order) => {

        if (order.id === id) {

          return {

            ...order,

            paymentStatus:
              status,
          };
        }

        return order;

      });

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(
        updatedOrders
      )
    );
  };

  // =========================
  // 🗑 DELETE ORDER
  // =========================
  const deleteOrder = (id) => {

    const confirmDelete =
      window.confirm(
        "Delete this order?"
      );

    if (!confirmDelete)
      return;

    const updatedOrders =
      orders.filter(
        (order) =>
          order.id !== id
      );

    setOrders(updatedOrders);

    localStorage.setItem(
      "orders",
      JSON.stringify(
        updatedOrders
      )
    );
  };

  // =========================
  // 🚪 LOGOUT
  // =========================
  const logout = () => {

    localStorage.removeItem(
      "isAdmin"
    );

    window.location.href =
      "/admin";
  };

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

              Manage orders, payments & customers

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

            <p className="text-gray-500">

              Orders will appear here after customers place orders.

            </p>

          </div>

        ) : (

          <div className="space-y-8">

            {filteredOrders
              .slice()
              .reverse()
              .map((order) => (

                <div
                  key={order.id}
                  className="bg-white rounded-3xl shadow-xl border p-8"
                >

                  {/* TOP */}
                  <div className="flex flex-col lg:flex-row justify-between gap-8">

                    {/* CUSTOMER */}
                    <div className="flex-1">

                      <h2 className="text-3xl font-bold mb-5">

                        {
                          order.customerName ||
                          "Customer"
                        }

                      </h2>

                      <div className="grid md:grid-cols-2 gap-4">

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-sm text-gray-500 mb-1">

                            Phone

                          </p>

                          <p className="font-bold">

                            {
                              order.phoneNumber ||
                              "-"
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-sm text-gray-500 mb-1">

                            Order ID

                          </p>

                          <p className="font-bold">

                            {order.id}

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl md:col-span-2">

                          <p className="text-sm text-gray-500 mb-1">

                            Address

                          </p>

                          <p className="font-bold">

                            {
                              order.address ||
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
                              order.pincode ||
                              "-"
                            }

                          </p>

                        </div>

                        <div className="bg-gray-50 p-4 rounded-2xl">

                          <p className="text-sm text-gray-500 mb-1">

                            Date

                          </p>

                          <p className="font-bold">

                            {
                              order.createdAt ||
                              new Date().toLocaleDateString()
                            }

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
                              order.paymentStatus ||
                              "Pending"
                            }

                          </span>

                        </div>

                        <div className="flex flex-col gap-3">

                          <button
                            onClick={() =>
                              updatePaymentStatus(
                                order.id,
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
                                order.id,
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
                                order.id
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
                                    product.mrp || 0
                                  ) *
                                  Number(
                                    product.qty || 1
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

                  {/* TOTAL */}
                  <div className="mt-10 border-t pt-8 flex justify-between items-center">

                    <h3 className="text-2xl font-bold">

                      Grand Total

                    </h3>

                    <h2 className="text-5xl font-bold text-green-700">

                      ₹
                      {Number(
                        order.total || 0
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
import { useState } from "react";

import {
  doc,
  getDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const trackOrder = async () => {
    const entered =
      orderNumber.trim().toUpperCase();

    if (!entered) {
      alert("Please enter your order number");
      return;
    }

    try {
      setLoading(true);
      setOrder(null);

      const orderRef = doc(
        db,
        "publicTracking",
        entered
      );

      const orderSnap =
        await getDoc(orderRef);

      if (!orderSnap.exists()) {
        alert("Order not found");
        return;
      }

      setOrder(orderSnap.data());

    } catch (error) {
      console.error(
        "Track order error:",
        error
      );

      alert(
        "Unable to track order. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "processing":
        return "bg-purple-100 text-purple-700";

      case "shipped":
        return "bg-blue-100 text-blue-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const statusSteps = [
    "pending",
    "processing",
    "shipped",
    "delivered",
  ];

  const currentIndex =
    statusSteps.indexOf(
      order?.orderStatus
    );

  return (
    <section className="max-w-3xl mx-auto p-6 min-h-screen">

      <h1 className="text-4xl font-bold text-[#31572C] mb-8 text-center">
        Track Your Order
      </h1>

      <div className="bg-white p-6 rounded-3xl shadow">

        <label className="block font-semibold mb-2">
          Enter Order Number
        </label>

        <div className="flex flex-col md:flex-row gap-3">

          <input
            type="text"
            placeholder="Example: NF-1791438161039"
            value={orderNumber}
            onChange={(e) =>
              setOrderNumber(e.target.value)
            }
            className="flex-1 border p-3 rounded-xl"
          />

          <button
            onClick={trackOrder}
            disabled={loading}
            className="bg-[#31572C] text-white px-6 py-3 rounded-xl font-semibold"
          >
            {loading
              ? "Searching..."
              : "Track Order"}
          </button>

        </div>

      </div>

      {order && (
        <div className="mt-6 space-y-6">

          {/* ORDER DETAILS */}

          <div className="bg-white p-6 rounded-3xl shadow">

            <div className="flex justify-between items-start">

              <div>
                <p className="text-sm text-gray-500">
                  Order Number
                </p>

                <h2 className="text-xl font-bold text-[#31572C]">
                  {order.orderNumber}
                </h2>
              </div>

              <span
                className={`px-4 py-2 rounded-full font-semibold ${getStatusStyle(
                  order.orderStatus
                )}`}
              >
                {order.orderStatus}
              </span>

            </div>

            <div className="border-t mt-6 pt-6">

              <p className="text-sm text-gray-500">
                Order Date
              </p>

              <p className="font-semibold">
                {order.createdAt}
              </p>

            </div>

            <div className="border-t mt-6 pt-6">

              <p className="text-sm text-gray-500">
                Product
              </p>

              <p className="font-semibold">
                {order.product} × {order.qty}
              </p>

            </div>

            <div className="border-t mt-6 pt-6 flex justify-between">

              <span className="font-semibold">
                Order Total
              </span>

              <span className="text-xl font-bold">
                ₹
                {Number(
                  order.grandTotal || 0
                ).toFixed(2)}
              </span>

            </div>
            {(order.orderStatus === "shipped" ||
  order.orderStatus === "delivered") && (
  <div className="border-t mt-6 pt-6">
    <h3 className="font-bold text-lg text-[#31572C] mb-4">
      🚚 Delivery Details
    </h3>

    <div className="space-y-3">
      <div>
        <p className="text-sm text-gray-500">
          Courier
        </p>
        <p className="font-semibold">
          {order.courierName || "Not available"}
        </p>
      </div>

      <div>
        <p className="text-sm text-gray-500">
          Tracking Number
        </p>
        <p className="font-semibold">
          {order.trackingNumber || "Not available"}
        </p>
      </div>
    </div>
  </div>
)}
          </div>

          {/* ORDER STATUS */}

          <div className="bg-white p-6 rounded-3xl shadow">

            <h2 className="text-2xl font-bold mb-6">
              Order Status
            </h2>

            <div className="space-y-6">

              {statusSteps.map(
                (step, index) => {

                  const completed =
                    currentIndex >= index;

                  const titles = {
                    pending:
                      "Order Placed",

                    processing:
                      "Processing",

                    shipped:
                      "Shipped",

                    delivered:
                      "Delivered",
                  };

                  const descriptions = {
                    pending:
                      "Your order has been received.",

                    processing:
                      "Your order is being prepared.",

                    shipped:
                      "Your order has been handed over to the courier.",

                    delivered:
                      "Your order has been delivered.",
                  };

                  return (
                    <div
                      key={step}
                      className="flex gap-4"
                    >

                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold ${
                          completed
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {completed
                          ? "✓"
                          : index + 1}
                      </div>

                      <div>
                        <h3 className="font-bold">
                          {titles[step]}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {descriptions[step]}
                        </p>
                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>
      )}

    </section>
  );
}
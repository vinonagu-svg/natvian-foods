import { useEffect, useState } from "react";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function Orders() {
  const [orders, setOrders] = useState([]);
const [trackingData, setTrackingData] = useState({});
  // =========================
  // LIVE ORDERS
  // =========================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      const data = snap.docs
  .map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
  .filter((order) => !order.archived);

      data.sort((a, b) => {
       const aTime = a.createdAt?.seconds || 0;
        const bTime = b.createdAt?.seconds || 0;

       return bTime - aTime;
      });
      setOrders(data);
    });

    return () => unsub();
  }, []);

  // =========================
  // UPDATE STATUS
  // =========================
  const updateStatus = async (id, status) => {
  try {
    const orderRef = doc(db, "orders", id);

    if (status === "delivered") {
      await updateDoc(orderRef, {
        orderStatus: "delivered",
        archived: true,
        archiveType: "completed",
        deliveredAt: serverTimestamp(),
        archivedAt: serverTimestamp(),
      });
    }

    else if (status === "cancelled") {
      await updateDoc(orderRef, {
        orderStatus: "cancelled",
        archived: true,
        archiveType: "cancelled",
        cancelledAt: serverTimestamp(),
        archivedAt: serverTimestamp(),
      });
    }

    else if (status === "returned") {
      await updateDoc(orderRef, {
        orderStatus: "returned",
        archived: true,
        archiveType: "returned",
        returnedAt: serverTimestamp(),
        archivedAt: serverTimestamp(),
      });
    }

    else {
      await updateDoc(orderRef, {
        orderStatus: status,
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// =========================
// SAVE TRACKING
// =========================
const saveTracking = async (
  orderId,
  courierName,
  trackingNumber
) => {
  try {
    await updateDoc(
      doc(db, "orders", orderId),
      {
        courierName,
        trackingNumber,
      }
    );

    alert("Tracking Saved");
  } catch (err) {
    console.error(err);
  }
};

  // =========================
  // THERMAL PRINT FUNCTION (STEP 3)
  // =========================
  const printThermalLabel = (order) => {
    const printWindow = window.open("", "_blank");

    const items =
    order.items
    ?.map(
      (p) =>
        `${p.name} (${p.weight}) x ${p.qty}`
    )
    .join("<br/>") || "";
    printWindow.document.write(`
      <html>
        <head>
          <title>Thermal Label</title>
          <style>
            body {
              font-family: monospace;
              width: 300px;
              padding: 10px;
            }
            .center {
              text-align: center;
            }
            .line {
              border-top: 1px dashed #000;
              margin: 8px 0;
            }
          </style>
        </head>
        <body>

          <div class="center">
            <h2>Natvian Foods</h2>
            <p>ORDER LABEL</p>
          </div>

          <div class="line"></div>

          <p><b>Order ID:</b> ${order.orderNumber || order.id}</p>
          <p><b>Name:</b> ${order.customer?.name || ""}</p>
          <p><b>Phone:</b> ${order.customer?.phone || ""}</p>
          <p><b>City:</b> ${order.customer?.city || ""}</p>
          <p><b>Address:</b> ${order.customer?.address || ""}</p>

          <div class="line"></div>

          <b>Items:</b><br/>
          ${items}

          <div class="line"></div>

          <p><b>Total:</b> ₹${order.grandTotal || 0}</p>
          <p><b>Status:</b> ${order.orderStatus || ""}</p>

          <script>
            window.print();
          </script>

        </body>
      </html>
    `);

    printWindow.document.close();
  };

  // =========================
  // STATUS COLORS
  // =========================
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

    case "returned":
      return "bg-orange-100 text-orange-700";

    default:
      return "bg-gray-100 text-gray-600";
  }
};

  return (
    <div className="p-8 w-full min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">
          📦 Orders Management
        </h1>

        {/* NO ORDERS MESSAGE */}
{orders.length === 0 && (
  <div className="bg-white p-10 rounded-2xl shadow text-center mb-6">
    <h2 className="text-2xl font-bold">
      No Active Orders
    </h2>

    <p className="text-gray-500 mt-2">
      All orders have been completed or archived.
    </p>
  </div>
)}

<div className="space-y-4">
  {orders.map((order) => (
                <div
              key={order.id}
              className="bg-white p-6 rounded-2xl shadow"
            >
              {/* TOP */}
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-bold text-lg">
                  {order.customer?.name || "Customer"}
                  </h2>

                  <p className="text-sm text-gray-500">
                  {order.customer?.phone || ""}
                  {" | "}
                  {order.customer?.city || ""}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                  {order.customer?.address || ""}
                  </p>

                  <p className="text-sm text-gray-600">
                  PIN: {order.customer?.pincode || ""}
                  </p>

                  <p className="text-xs text-gray-400">
  Order ID: {order.orderNumber || order.id}
</p>

<p className="text-xs text-gray-400">
  Order Date:{" "}
  {order.createdAt?.seconds
    ? new Date(
        order.createdAt.seconds * 1000
      ).toLocaleString("en-IN")
    : "-"}
</p>

{order.courierName && (
  <p className="text-xs text-blue-600 mt-1">
    Courier: {order.courierName}
  </p>
)}

{order.trackingNumber && (
  <p className="text-xs text-blue-600">
    Tracking: {order.trackingNumber}
  </p>
)}
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ₹{order.grandTotal}
                  </p>
                  <p className="text-xs text-green-600">
                  Payment ID: {order.paymentId || "N/A"}
                  </p>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
              </div>

              {/* PRODUCTS */}
              <div className="mt-3 text-sm text-gray-600">
                {order.items?.map((p, i) => (
                <p key={i}>
                {p.name} ({p.weight}) × {p.qty}
                </p>
                ))}
              </div>
{order.orderStatus === "shipped" && (
  <div className="mt-4 border-t pt-4">

  <h3 className="font-semibold mb-2">
    Courier Details
  </h3>

  <div className="flex flex-wrap gap-2">

    <select
      value={
        trackingData[order.id]?.courierName ||
        order.courierName ||
        ""
      }
      onChange={(e) =>
        setTrackingData({
          ...trackingData,
          [order.id]: {
            ...trackingData[order.id],
            courierName: e.target.value,
          },
        })
      }
      className="border rounded-lg px-3 py-2"
    >
      <option value="">
        Select Courier
      </option>

      <option value="DTDC">
        DTDC
      </option>

      <option value="Professional Courier">
        Professional Courier
      </option>

      <option value="Delhivery">
        Delhivery
      </option>

      <option value="India Post">
        India Post
      </option>

      <option value="Bluedart">
        Bluedart
      </option>

    </select>

    <input
      type="text"
      placeholder="Tracking Number"
      value={
        trackingData[order.id]
          ?.trackingNumber ||
        order.trackingNumber ||
        ""
      }
      onChange={(e) =>
        setTrackingData({
          ...trackingData,
          [order.id]: {
            ...trackingData[order.id],
            trackingNumber: e.target.value,
          },
        })
      }
      className="border rounded-lg px-3 py-2 w-72"
    />

    <button
      onClick={() =>
        saveTracking(
          order.id,
          trackingData[order.id]
            ?.courierName,
          trackingData[order.id]
            ?.trackingNumber
        )
      }
      className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
    >
      Save Tracking
    </button>

  </div>

</div>
)}
              {/* ACTIONS */}
              <div className="flex gap-3 mt-4 flex-wrap">

                {/* PRINT LABEL (NEW) */}
                <button
                  onClick={() => printThermalLabel(order)}
                  className="px-4 py-2 bg-black text-white rounded-xl"
                >
                  Print Thermal Label (80mm)
                </button>

                {/* SHIPPED */}
                {order.orderStatus === "pending" && (
  <button
    onClick={() =>
      updateStatus(order.id, "processing")
    }
    className="px-4 py-2 bg-purple-600 text-white rounded-xl"
  >
    Start Processing
  </button>
)}

{order.orderStatus === "processing" && (
  <button
    onClick={() =>
      updateStatus(order.id, "shipped")
    }
    className="px-4 py-2 bg-blue-600 text-white rounded-xl"
  >
    Mark as Shipped
  </button>
)}
<button
  onClick={() => {
    const phone = order.customer?.phone;

    const msg =
      `Hello ${order.customer?.name},

Your Natvian Foods order has been shipped.

Courier: ${order.courierName || ""}
Tracking No: ${order.trackingNumber || ""}

Thank you for shopping with Natvian Foods.`;

    window.open(
      `https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  }}
  className="bg-green-600 text-white px-4 py-2 rounded-lg"
>
  WhatsApp Customer
</button>
                {/* DELIVERED */}
                {order.orderStatus === "shipped" && (
  <button
    disabled={!order.trackingNumber}
    onClick={() =>
      updateStatus(order.id, "delivered")
    }
    className={`px-4 py-2 rounded-xl text-white ${
      order.trackingNumber
        ? "bg-green-600"
        : "bg-gray-400 cursor-not-allowed"
    }`}
  >
    Mark as Delivered
  </button>
)}
{order.orderStatus !== "delivered" &&
 order.orderStatus !== "cancelled" && (
  <button
    onClick={() =>
      updateStatus(order.id, "cancelled")
    }
    className="px-4 py-2 bg-red-600 text-white rounded-xl"
  >
    Cancel Order
  </button>
)}
                {/* RESET */}
                {order.orderStatus !== "pending" && (
                  <button
                    onClick={() =>
                      updateStatus(order.id, "pending")
                    }
                    className="px-4 py-2 bg-yellow-500 text-white rounded-xl"
                  >
                    Reset to Pending
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      </div>
  );
}
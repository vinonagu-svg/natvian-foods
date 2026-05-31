import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  // =========================
  // LIVE ORDERS
  // =========================
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

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
      await updateDoc(doc(db, "orders", id), {
        orderStatus: status,
      });
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
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />

      <div className="ml-64 p-8 w-full min-h-screen bg-gray-100">
        <h1 className="text-4xl font-bold mb-6">
          📦 Orders Management
        </h1>

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
                      updateStatus(order.id, "shipped")
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-xl"
                  >
                    Mark as Shipped
                  </button>
                )}

                {/* DELIVERED */}
                {order.orderStatus === "shipped" && (
                  <button
                    onClick={() =>
                      updateStatus(order.id, "delivered")
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-xl"
                  >
                    Mark as Delivered
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
    </div>
  );
}
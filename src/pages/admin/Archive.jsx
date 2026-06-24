import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { exportOrdersToExcel } from "../../utils/exportOrders";
import { generateInvoice } from "../../utils/generateInvoice";


export default function Archive() {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [showReturnPopup, setShowReturnPopup] = useState(false);
const [selectedOrderId, setSelectedOrderId] = useState(null);
const [returnReason, setReturnReason] = useState("");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "orders"), (snap) => {
      const data = snap.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((order) => order.archived === true);

      data.sort((a, b) => {
        const aTime = a.archivedAt?.seconds || 0;
        const bTime = b.archivedAt?.seconds || 0;
        return bTime - aTime;
      });

      setOrders(data);
    });

    return () => unsub();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return "-";

    return new Date(
      timestamp.seconds * 1000
    ).toLocaleString("en-IN");
  };

  const monthlyRevenue = orders
  .filter(
    (order) =>
      order.archiveType === "completed" &&
      order.deliveredAt
  )
  .filter((order) => {
      if (!order.deliveredAt) return false;

      const date = order.deliveredAt.toDate();
      const now = new Date();

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    })
    .reduce(
      (sum, order) => sum + (order.grandTotal || 0),
      0
    );

  const totalRevenue = orders
  .filter(
    (o) =>
      o.archiveType === "completed" ||
      o.orderStatus === "delivered"
  )
  .reduce(
    (sum, order) =>
      sum + (order.grandTotal || 0),
    0
  );

  const cities = [
    ...new Set(
      orders
        .map((o) => o.customer?.city)
        .filter(Boolean)
    ),
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.orderNumber || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCity =
      !cityFilter ||
      order.customer?.city === cityFilter;

    return matchesSearch && matchesCity;
  });
const exportThisMonth = () => {
  const now = new Date();

  const monthOrders = orders.filter((order) => {
    if (!order.deliveredAt) return false;

    const date = order.deliveredAt.toDate();

    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  exportOrdersToExcel(
    monthOrders,
    `Natvian_Month_${now.getMonth() + 1}`
  );
};

const exportThisWeek = () => {
  const today = new Date();

  const start = new Date(today);

  start.setDate(
    today.getDate() - today.getDay()
  );

  start.setHours(0, 0, 0, 0);

  const weekOrders = orders.filter((order) => {
    if (!order.deliveredAt) return false;

    const date = order.deliveredAt.toDate();

    return date >= start;
  });

  exportOrdersToExcel(
    weekOrders,
    "Natvian_Weekly_Report"
  );
};

const exportCustomRange = () => {
  if (!fromDate || !toDate) {
    alert("Select From and To dates");
    return;
  }

  const start = new Date(fromDate);

  const end = new Date(toDate);

  end.setHours(23, 59, 59);

  const filtered = orders.filter((order) => {
    if (!order.deliveredAt) return false;

    const date = order.deliveredAt.toDate();

    return date >= start && date <= end;
  });

    exportOrdersToExcel(
    filtered,
    "Natvian_Custom_Report"
  );
};
const markAsReturned = async () => {
  try {
    await updateDoc(
      doc(db, "orders", selectedOrderId),
      {
        orderStatus: "returned",
        archiveType: "returned",
        returnReason,
        returnedAt: serverTimestamp(),
      }
    );

    setShowReturnPopup(false);
    setSelectedOrderId(null);
    setReturnReason("");

    alert("Order marked as Returned");
  } catch (err) {
    console.error(err);
  }
};
const completedOrders =
  orders.filter(
    (o) => o.archiveType === "completed"
  ).length;

const cancelledOrders =
  orders.filter(
    (o) => o.archiveType === "cancelled"
  ).length;

const returnedOrders =
  orders.filter(
    (o) => o.archiveType === "returned"
  ).length;
  return (
    <div className="p-8 min-h-screen bg-gray-100">

      {/* Header */}
      <h1 className="text-4xl font-bold mb-6">
        📦 Archived Orders
      </h1>
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-wrap gap-3">

  <button
    onClick={exportThisWeek}
    className="bg-blue-600 text-white px-4 py-2 rounded-lg"
  >
    Export This Week
  </button>

  <button
    onClick={exportThisMonth}
    className="bg-green-600 text-white px-4 py-2 rounded-lg"
  >
    Export This Month
  </button>

  <input
    type="date"
    value={fromDate}
    onChange={(e) =>
      setFromDate(e.target.value)
    }
    className="border px-3 py-2 rounded-lg"
  />

  <input
    type="date"
    value={toDate}
    onChange={(e) =>
      setToDate(e.target.value)
    }
    className="border px-3 py-2 rounded-lg"
  />

  <button
    onClick={exportCustomRange}
    className="bg-purple-600 text-white px-4 py-2 rounded-lg"
  >
    Export Custom Range
  </button>

</div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-6 gap-4 mb-6">

  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-500">Archived</p>
    <h2 className="text-3xl font-bold">
      {orders.length}
    </h2>
  </div>

  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-500">Completed</p>
    <h2 className="text-3xl font-bold text-green-600">
      {completedOrders}
    </h2>
  </div>

  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-500">Cancelled</p>
    <h2 className="text-3xl font-bold text-red-600">
      {cancelledOrders}
    </h2>
  </div>

  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-500">Returned</p>
    <h2 className="text-3xl font-bold text-orange-600">
      {returnedOrders}
    </h2>
  </div>

  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-500">Monthly Revenue</p>
    <h2 className="text-3xl font-bold text-green-600">
      ₹{monthlyRevenue.toLocaleString()}
    </h2>
  </div>

  <div className="bg-white p-5 rounded-xl shadow">
    <p className="text-gray-500">Total Revenue</p>
    <h2 className="text-3xl font-bold text-blue-600">
      ₹{totalRevenue.toLocaleString()}
    </h2>
  </div>

</div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow mb-6 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search Order Number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 flex-1"
        />

        <select
          value={cityFilter}
          onChange={(e) =>
            setCityFilter(e.target.value)
          }
          className="border rounded-lg px-4 py-2"
        >
          <option value="">
            All Cities
          </option>

          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>

      </div>
      {/* Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

 <thead className="bg-green-600 text-white">
  <tr>
    <th className="p-4 text-left">Order No</th>
    <th className="p-4 text-left">Customer</th>
    <th className="p-4 text-left">Phone</th>
    <th className="p-4 text-left">City</th>
    <th className="p-4 text-left">Amount</th>
    <th className="p-4 text-left">Status</th>
    <th className="p-4 text-left">Delivered</th>
    <th className="p-4 text-left">Invoice</th>
  </tr>
</thead>
            <tbody>

              {filteredOrders.length === 0 ? (
                <tr>
                  <td
  colSpan="8"
  className="p-8 text-center text-gray-500"
>
                    No archived orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4">
                      {order.orderNumber || order.id}
                    </td>

                    <td className="p-4">
                      {order.customer?.name}
                    </td>

                    <td className="p-4">
                      {order.customer?.phone}
                    </td>

                    <td className="p-4">
                      {order.customer?.city}
                    </td>

                    <td className="p-4 font-semibold">
                      ₹{order.grandTotal}
                    </td>

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
                        {order.orderStatus}
                      </span>
                    </td>

                    <td className="p-4">
  {formatDate(order.deliveredAt)}
</td>

<td className="p-4 flex gap-2">

  <button
    onClick={() => generateInvoice(order)}
    className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm"
  >
    Invoice PDF
  </button>

  {order.archiveType === "completed" && (
    <button
      onClick={() => {
  setSelectedOrderId(order.id);
  setShowReturnPopup(true);
}}
      className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg text-sm"
    >
      Mark Returned
    </button>
  )}

</td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
{showReturnPopup && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

    <div className="bg-white p-6 rounded-xl w-[400px]">

      <h2 className="text-xl font-bold mb-4">
        Return Reason
      </h2>

      <textarea
        value={returnReason}
        onChange={(e) =>
          setReturnReason(e.target.value)
        }
        placeholder="Enter return reason..."
        className="w-full border rounded-lg p-3 h-32"
      />

      <div className="flex justify-end gap-3 mt-4">

        <button
          onClick={() => {
            setShowReturnPopup(false);
            setSelectedOrderId(null);
            setReturnReason("");
          }}
          className="px-4 py-2 bg-gray-300 rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={markAsReturned}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg"
        >
          Save Return
        </button>

      </div>

    </div>

  </div>
)}
    </div>
  );
}
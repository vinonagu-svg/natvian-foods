import { useEffect, useState } from "react";

import {
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { db } from "../firebase";

export default function AdminOrders() {

  const [orders, setOrders] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    const fetchOrders = async () => {

      try {

        const q = query(
          collection(db, "orders"),
          orderBy("createdAt", "desc")
        );

        const snapshot =
          await getDocs(q);

        const list =
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

        setOrders(list);

      } catch (error) {

        console.error(error);

      } finally {

        setLoading(false);
      }
    };

    fetchOrders();

  }, []);

  if (loading) {

    return (
      <div className="p-10 text-2xl font-bold">
        Loading Orders...
      </div>
    );
  }

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-8">
        Orders
      </h1>

      {orders.length === 0 && (

        <div className="text-xl">
          No orders found
        </div>
      )}

      <div className="space-y-6">

        {orders.map((order) => (

          <div
            key={order.id}
            className="border rounded-2xl p-6 bg-white shadow"
          >

            <h2 className="text-xl font-bold mb-2">
              {order.customerName}
            </h2>

            <p>
              Phone:
              {" "}
              {order.phoneNumber}
            </p>

            <p>
              Address:
              {" "}
              {order.address}
            </p>

            <p>
              State:
              {" "}
              {order.state}
            </p>

            <p>
              Pincode:
              {" "}
              {order.pincode}
            </p>

            <p className="font-bold mt-2">
              Total:
              {" "}
              ₹{order.grandTotal}
            </p>

            <p>
              Payment:
              {" "}
              {order.paymentStatus}
            </p>

            <div className="mt-4">

              <h3 className="font-bold mb-2">
                Products
              </h3>

              {order.products?.map(
                (item, i) => (

                  <div key={i}>

                    {item.name}
                    {" "}
                    ({item.weight})
                    {" "}
                    x
                    {" "}
                    {item.qty}

                  </div>
                )
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
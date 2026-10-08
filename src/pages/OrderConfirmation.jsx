import { useLocation, Link } from "react-router-dom";

export default function OrderConfirmation() {
  const location = useLocation();

  const order = location.state?.order;

  if (!order) {
    return (
      <section className="max-w-3xl mx-auto p-6 min-h-screen">
        <div className="bg-white p-8 rounded-3xl shadow text-center">

          <h1 className="text-3xl font-bold text-red-600">
            Order information not found
          </h1>

          <p className="text-gray-500 mt-3">
            Please return to the home page.
          </p>

          <Link
            to="/"
            className="inline-block mt-6 bg-[#31572C] text-white px-6 py-3 rounded-xl"
          >
            Continue Shopping
          </Link>

        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto p-6 min-h-screen">

      <div className="bg-white p-8 rounded-3xl shadow text-center">

        <div className="text-6xl mb-4">
          🎉
        </div>

        <h1 className="text-3xl font-bold text-[#31572C]">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600 mt-3">
          Thank you for shopping with Natvian Foods.
        </p>

        <div className="mt-8 bg-gray-50 rounded-2xl p-6 text-left">

          <div className="flex justify-between border-b pb-3">
            <span className="font-semibold">
              Order Number
            </span>

            <span className="font-bold text-[#31572C]">
              {order.orderNumber}
            </span>
          </div>

          <div className="flex justify-between py-3 border-b">
            <span className="font-semibold">
              Payment
            </span>

            <span className="text-green-600 font-semibold">
              Successful
            </span>
          </div>

          <div className="flex justify-between py-3">
            <span className="font-semibold">
              Order Total
            </span>

            <span className="font-bold">
              ₹{Number(order.grandTotal || 0).toFixed(2)}
            </span>
          </div>

        </div>

        <div className="mt-6 text-gray-600">

          <p>
            Your order has been received and will be
            processed shortly.
          </p>

          <p className="mt-2">
            Please keep your order number for tracking.
          </p>

        </div>

        <Link
          to="/"
          className="inline-block mt-8 bg-[#31572C] text-white px-8 py-3 rounded-xl font-semibold"
        >
          Continue Shopping
        </Link>

      </div>

    </section>
  );
}
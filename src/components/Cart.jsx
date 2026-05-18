export default function Cart({
  cart,
  removeFromCart,
  totalPrice
}) {

  const whatsappMessage = `
Hello, I want to place an order.

Total Amount: ₹${totalPrice}
  `

  return (
    <div className="bg-white p-10 m-10 rounded-3xl shadow-xl">

      <h1 className="text-4xl font-bold text-black mb-8">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (

        <p className="text-gray-500 text-xl">
          Your cart is empty
        </p>

      ) : (

        <>
          <div className="space-y-5 mb-8">

            {cart.map((item, index) => (

              <div
                key={index}
                className="flex justify-between items-center border p-5 rounded-2xl"
              >

                <div className="flex items-center gap-4">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />

                  <div>

                    <h2 className="text-xl font-bold text-black">
                      {item.name}
                    </h2>

                    <p className="text-green-700 font-semibold">
                      ₹{item.offerPrice}
                    </p>

                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl"
                >
                  Remove
                </button>

              </div>
            ))}

          </div>

          <h2 className="text-3xl font-bold text-black mb-6">
            Total: ₹{totalPrice}
          </h2>

          <a
            href={`https://wa.me/917411498799?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-2xl text-xl font-bold transition"
          >
            Proceed To Checkout
          </a>
        </>
      )}

    </div>
  )
}
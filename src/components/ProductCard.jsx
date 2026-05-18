export default function ProductCard(props) {

  const { product, addToCart } = props

  return (
    <div className="bg-white rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300">

      <div className="overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-72 md:h-80 w-full object-cover hover:scale-105 transition duration-500"
        />
      </div>

      <div className="p-8">

        <div className="flex items-center justify-between mb-4">

          <p className="text-sm font-medium bg-[#eef4e7] text-[#31572C] px-4 py-2 rounded-full">
            {product.weight}
          </p>

          <div className="text-right">

            <p className="text-gray-400 line-through text-sm">
              ₹{product.price}
            </p>

            <p className="text-3xl font-bold text-[#4F772D]">
              ₹{product.offerPrice}
            </p>

          </div>
        </div>

        <h3 className="text-2xl font-bold text-[#31572C] mb-4">
          {product.name}
        </h3>

        <p className="text-gray-600 leading-relaxed mb-8">
          Premium healthy product made with carefully selected natural ingredients.
        </p>

        <div className="flex gap-4">

          <button
            onClick={() => addToCart(product)}
            className="flex-1 bg-[#4F772D] hover:bg-[#31572C] text-white py-3 rounded-2xl font-semibold transition"
          >
            Add To Cart
          </button>

          <a
            href={`https://wa.me/917411498799?text=I want to order ${product.name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-2xl font-semibold transition text-center"
          >
            WhatsApp
          </a>

        </div>
      </div>
    </div>
  )
}
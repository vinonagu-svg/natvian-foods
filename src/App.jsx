import { useState } from 'react'
import { products } from './data/products'

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import ProductGrid from './components/ProductGrid'
import About from './components/About'
import FAQ from './components/FAQ'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cart from './components/Cart'

import MurungabannerImage from './assets/Murunga-banner.png'
import BananabannerImage from './assets/Bloom-banner.png'

export default function App() {

  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')

  /* CART STATE */
  const [cart, setCart] = useState([])

  /* ADD TO CART FUNCTION */
const addToCart = (product) => {
  setCart([...cart, product])
}

/* REMOVE FROM CART */
const removeFromCart = (index) => {
  const updatedCart = [...cart]
  updatedCart.splice(index, 1)
  setCart(updatedCart)
}

/* TOTAL PRICE */
const totalPrice = cart.reduce(
  (total, item) => total + item.offerPrice,
  0
)

  return (
    <div
      className={
        darkMode
          ? 'bg-[#101510] text-white min-h-screen'
          : 'bg-[#F8F7F2] text-gray-800 min-h-screen'
      }
    >

      {/* NAVBAR */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        language={language}
        setLanguage={setLanguage}
        cartCount={cart.length}
      />

      {/* HERO */}
      <Hero
        language={language}
        MurungabannerImage={MurungabannerImage}
        BananabannerImage={BananabannerImage}
      />

      {/* FEATURES */}
      <Features />

      {/* PRODUCTS */}
      <ProductGrid
        products={products}
        addToCart={addToCart}
      />
      {/* CART */}
      <Cart
       cart={cart}
       removeFromCart={removeFromCart}
       totalPrice={totalPrice}
      />
      {/* ABOUT */}
      <About />

      {/* FAQ */}
      <FAQ />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* CONTACT */}
      <Contact />

      {/* FOOTER */}
      <Footer />

    </div>
  )
}
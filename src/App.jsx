import { useState } from 'react'

import logo from './assets/Logo.png'
import bananaBloom from './assets/banana-bloom.png'
import healthMix from './assets/Murunga-health-mix.png'
import herbal from './assets/Herbal-Tea.png'
import MurungabannerImage from './assets/Murunga-banner.png'
import BananabannerImage from './assets/Bloom-banner.png'
import bannerImage from './assets/All-Products-banner.png'


export default function NatvianFoodsPremiumWebsite() {
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('en')
  const products = [
    {
      name: 'Banana Bloom Health Mix',
      weight: '500g',
      price: '₹499',
      image: bananaBloom
    },
    {
      name: 'Murunga Health Mix',
      weight: '500g',
      price: '₹449',
      image: healthMix
    },
    {
      name: 'Avaranpoo Herbal Infusion',
      weight: '100g',
      price: '₹199',
      image: herbal
    },
  ]

  const benefits = [
    '100% Natural Ingredients',
    'Traditional Homemade Recipes',
    'No Artificial Preservatives',
    'Healthy Everyday Nutrition',
  ]

  return (
    <div className={darkMode ? 'bg-[#101510] text-white min-h-screen font-sans transition duration-500' : 'bg-[#F8F7F2] text-gray-800 min-h-screen font-sans transition duration-500'}>
      {/* NAVBAR */}
<nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
  <div className="max-w-7xl mx-auto px-6 py-2 flex items-center gap-10">

    {/* LOGO */}
<div className="flex items-center gap-3 shrink-0">
  <img
    src={logo}
    alt="Natvian Foods"
    className="h-40 md:h-44 w-auto"
  />

<h1
  className="text-4xl md:text-5xl font-bold text-[#31572C] leading-none tracking-wide"
  style={{ fontFamily: 'Times New Roman' }}
>
  Natvian Foods
</h1>
</div>

    {/* MENU */}
    <div className="hidden md:flex gap-8 font-medium text-gray-700 items-center ml-auto">
      <a href="#home" className="hover:text-[#4F772D] transition">
        Home
      </a>

      <a href="#products" className="hover:text-[#4F772D] transition">
        Products
      </a>

      <a href="#about" className="hover:text-[#4F772D] transition">
        About
      </a>

      <a href="#contact" className="hover:text-[#4F772D] transition">
        Contact
      </a>

      <button
        onClick={() => setDarkMode(!darkMode)}
        className="bg-[#4F772D] text-white px-4 py-2 rounded-xl"
      >
        {darkMode ? '☀ Light' : '🌙 Dark'}
      </button>

      <button
        onClick={() => setLanguage(language === 'en' ? 'ta' : 'en')}
        className="border border-[#4F772D] text-[#4F772D] px-4 py-2 rounded-xl"
      >
        {language === 'en' ? 'தமிழ்' : 'English'}
      </button>
    </div>

  </div>
</nav>

      {/* HERO SECTION */}
<section
  id="home"
  className="relative overflow-hidden bg-gradient-to-br from-[#F8F7F2] via-[#eef4e7] to-[#dce8cf]"
>
  <div className="max-w-7xl mx-auto px-6 py-12 md:py-14 grid lg:grid-cols-2 gap-16 items-center">

    {/* LEFT CONTENT */}
    <div className="relative z-10">
      <p className="uppercase tracking-[5px] text-[#4F772D] font-semibold mb-5">
        Natural • Healthy • Traditional
      </p>

<h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-8 text-[#31572C] max-w-[700px]">
  {language === 'en' ? (
    <>
      Premium Traditional Foods <br />
      For Healthy Living
    </>
  ) : (
    <>
      ஆரோக்கியமான வாழ்க்கைக்கான <br />
      பாரம்பரிய உணவுகள்
    </>
  )}
</h2>

      <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10 max-w-xl">
        Discover wholesome nutrition inspired by traditional recipes.
        Natvian Foods brings together health, taste, and natural
        ingredients for modern lifestyles.
      </p>

      {/* BENEFITS */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        {[
          '100% Natural',
          'Rich Nutrients',
          'No Preservatives',
          'Traditional Goodness',
        ].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 bg-white/80 backdrop-blur-md rounded-2xl px-4 py-3 shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-[#eef4e7] flex items-center justify-center text-[#31572C] font-bold">
              ✓
            </div>

            <p className="font-semibold text-[#31572C] text-sm md:text-base">
              {item}
            </p>
          </div>
        ))}
      </div>

      {/* BUTTONS */}
      <div className="flex flex-wrap gap-5">
        <button className="bg-[#4F772D] hover:bg-[#31572C] text-white px-8 py-4 rounded-2xl shadow-xl text-lg font-semibold transition duration-300">
          Shop Healthy Today
        </button>

        <button className="border-2 border-[#4F772D] text-[#4F772D] hover:bg-[#4F772D] hover:text-white px-8 py-4 rounded-2xl text-lg font-semibold transition duration-300">
          Explore More
        </button>
      </div>
    </div>

    {/* RIGHT IMAGE SECTION */}
    <div className="relative flex flex-col gap-6 items-end w-full">

      {/* MURUNGA */}
      <div className="relative w-full max-w-[520px]">
        <img
          src={MurungabannerImage}
          alt="Murunga Banner"
          className="w-full rounded-[28px] shadow-2xl"
        />

        <div className="absolute top-4 right-4 bg-white rounded-full shadow-lg px-4 py-3 hidden md:block">
          <p className="text-[#31572C] font-bold text-sm text-center leading-tight">
            Strength <br /> & Naturally
          </p>
        </div>
      </div>

      {/* BANANA BLOOM */}
      <div className="relative w-full max-w-[520px]">
        <img
          src={BananabannerImage}
          alt="Banana Bloom Banner"
          className="w-full rounded-[28px] shadow-2xl"
        />

        <div className="absolute bottom-4 right-4 bg-[#31572C] text-white px-4 py-2 rounded-full shadow-lg text-sm font-bold">
          Best Seller
        </div>
      </div>

    </div>

  </div>

  {/* BOTTOM STRIP */}
  <div className="bg-gradient-to-r from-[#1f4d1f] to-[#31572C] py-5 mt-6">
    <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-10 text-white text-sm md:text-lg font-medium">
      <span>🌿 Natural Ingredients</span>
      <span>🥣 Traditional Goodness</span>
      <span>💚 Modern Lifestyle</span>
    </div>
  </div>

</section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-6">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-lg hover:-translate-y-2 transition duration-300"
            >
              <div className="w-14 h-14 bg-[#4F772D] rounded-2xl flex items-center justify-center text-white text-2xl mb-5">
                ✓
              </div>

              <h3 className="text-xl font-bold text-[#31572C] leading-snug">
                {item}
              </h3>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[4px] text-[#4F772D] font-semibold mb-4">
            Our Collection
          </p>

          <h2 className="text-5xl font-bold text-[#31572C] mb-5">
            Featured Products
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Healthy food products made using traditional methods and premium
            natural ingredients.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-[32px] overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition duration-300"
            >
              <div className="overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-80 w-full object-cover hover:scale-105 transition duration-500"
                />
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium bg-[#eef4e7] text-[#31572C] px-4 py-2 rounded-full">
                    {product.weight}
                  </p>

                  <p className="text-3xl font-bold text-[#4F772D]">
                    {product.price}
                  </p>
                </div>

                <h3 className="text-2xl font-bold text-[#31572C] mb-4 leading-snug">
                  {product.name}
                </h3>

                <p className="text-gray-600 leading-relaxed mb-8">
                  Premium healthy product made with carefully selected natural
                  ingredients.
                </p>

                <div className="flex gap-4">
                  <button className="flex-1 bg-[#4F772D] hover:bg-[#31572C] text-white py-3 rounded-2xl font-semibold transition">
                    Add To Cart
                  </button>

                  <button className="flex-1 border border-[#4F772D] text-[#4F772D] hover:bg-[#4F772D] hover:text-white py-3 rounded-2xl font-semibold transition">
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="bg-white py-24 px-6 border-y border-gray-100"
      >
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div>
            <img
              src={bannerImage}
              alt="About Natvian Foods"
              className="rounded-[40px] shadow-2xl"
            />
          </div>

          <div>
            <p className="uppercase tracking-[4px] text-[#4F772D] font-semibold mb-4">
              About Us
            </p>

            <h2 className="text-5xl font-bold text-[#31572C] mb-8 leading-tight">
              Bringing Traditional Nutrition Back To Everyday Life
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Natvian Foods focuses on natural wellness products inspired by
              traditional recipes and healthy lifestyles.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              We believe healthy food should be simple, natural, and nourishing.
              Our products are crafted carefully using premium ingredients for
              modern families.
            </p>

            <div className="grid grid-cols-2 gap-6 mb-10">
              <div className="bg-[#F8F7F2] p-6 rounded-3xl">
                <h3 className="text-4xl font-bold text-[#4F772D] mb-2">
                  100%
                </h3>
                <p className="text-gray-600">Natural Ingredients</p>
              </div>

              <div className="bg-[#F8F7F2] p-6 rounded-3xl">
                <h3 className="text-4xl font-bold text-[#4F772D] mb-2">
                  0%
                </h3>
                <p className="text-gray-600">Artificial Flavours</p>
              </div>
            </div>

            <button className="bg-[#4F772D] hover:bg-[#31572C] text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transition">
              Explore More
            </button>
          </div>
        </div>
      </section>

      {/* NUTRITION BENEFITS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[#31572C] mb-5">
            Nutrition Benefits
          </h2>
          <div className="grid md:grid-cols-4 gap-8 mt-12">
            {['Protein Rich', 'High Fiber', 'Natural Energy', 'Immunity Support'].map((item, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl hover:scale-105 transition duration-300">
                <div className="text-5xl mb-4">🌿</div>
                <h3 className="text-2xl font-bold text-[#31572C]">{item}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-5xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-[#31572C] mb-5">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-6">
          {['Are your products natural?', 'Do you ship across India?', 'Do products contain preservatives?'].map((faq, index) => (
            <div key={index} className="bg-white rounded-3xl p-8 shadow-lg">
              <h3 className="text-2xl font-semibold text-[#31572C] mb-3">{faq}</h3>
              <p className="text-gray-600">Yes, Natvian Foods products are made with carefully selected ingredients.</p>
            </div>
          ))}
        </div>
      </section>

      {/* INSTAGRAM FEED */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-[#31572C] mb-12">Instagram Feed</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1,2,3,4].map((item) => (
              <img
                key={item}
                src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1200&auto=format&fit=crop"
                alt="Instagram"
                className="rounded-3xl h-72 w-full object-cover hover:scale-105 transition duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="uppercase tracking-[4px] text-[#4F772D] font-semibold mb-4">
            Testimonials
          </p>

          <h2 className="text-5xl font-bold text-[#31572C]">
            What Customers Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-[32px] p-8 shadow-xl"
            >
              <div className="text-[#90A955] text-3xl mb-5">★★★★★</div>

              <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                Excellent quality products with authentic taste and premium
                packaging. Highly recommended for healthy lifestyle.
              </p>

              <div>
                <h4 className="font-bold text-xl text-[#31572C]">
                  Happy Customer
                </h4>
                <p className="text-gray-500">Verified Buyer</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="contact"
        className="bg-gradient-to-r from-[#31572C] to-[#4F772D] text-white py-24 px-6"
      >
        <div className="max-w-5xl mx-auto text-center">
          <p className="uppercase tracking-[4px] text-[#dce8cf] font-semibold mb-5">
            Contact Us
          </p>

          <h2 className="text-5xl md:text-6xl font-bold mb-8 leading-tight">
            Ready To Start Your Healthy Journey?
          </h2>

          <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Contact Natvian Foods for orders, enquiries, wholesale enquiries, and partnership opportunities.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://wa.me/917411498799"
              target="_blank"
              className="bg-white text-[#31572C] hover:bg-gray-100 px-10 py-4 rounded-2xl text-lg font-bold shadow-xl transition inline-block"
            >
              WhatsApp: +91-7411498799
            </a>
            <a
             href="mailto:Natvianfoods@gmail.com"
             className="border-2 border-white hover:bg-white hover:text-[#31572C] px-10 py-4 rounded-2xl text-lg font-bold transition inline-block"
            >
             Email Us
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#1f2d16] text-white py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div>
            <h3 className="text-3xl font-bold mb-5">Natvian Foods</h3>

            <p className="text-gray-400 leading-relaxed mb-6">
              Traditional healthy foods crafted for modern wellness and healthy
              lifestyles.
            </p>

            <p className="text-[#90A955] font-semibold">
              thenativefood.com
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-5">Quick Links</h4>

            <div className="flex flex-col gap-4 text-gray-400">
              <a href="#home" className="hover:text-white transition">
                Home
              </a>
              <a href="#products" className="hover:text-white transition">
                Products
              </a>
              <a href="#about" className="hover:text-white transition">
                About
              </a>
              <a href="#contact" className="hover:text-white transition">
                Contact
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-5">Business Details</h4>

            <div className="space-y-4 text-gray-400">
              <p>FSSAI Lic No: 22426402000209</p>
              <p>GSTIN: 33ATHPN4463C1ZW</p>
              <p>UDYAM: UDYAM-TN-03-0316573</p>
              <p>Natvian Foods, 3/147A, Chettiyar Thottam, Periyathottampudur, Karamadai Block, Coimbatore, Tamil Nadu - 638459</p>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-5">Follow Us</h4>

            <div className="flex gap-4">
              <div className="w-12 h-12 rounded-full bg-[#4F772D] flex items-center justify-center hover:scale-110 transition cursor-pointer">
                F
              </div>

              <div className="w-12 h-12 rounded-full bg-[#4F772D] flex items-center justify-center hover:scale-110 transition cursor-pointer">
                I
              </div>

              <div className="w-12 h-12 rounded-full bg-[#4F772D] flex items-center justify-center hover:scale-110 transition cursor-pointer">
                W
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-14 pt-8 text-center text-gray-500">
          © 2026 Natvian Foods. All Rights Reserved.
        </div>
      </footer>
    </div>
  )
}

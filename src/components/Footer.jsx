export default function Footer() {
  return (
    <footer className="bg-[#1f2d16] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">

        {/* BRAND */}
        <div>
          <h3 className="text-3xl font-bold mb-5">
            Natvian Foods
          </h3>

          <p className="text-gray-400">
            Traditional healthy foods crafted for modern wellness.
          </p>
        </div>


        {/* QUICK LINKS */}
        <div>
          <h4 className="text-xl font-semibold mb-5">
            Quick Links
          </h4>

          <div className="flex flex-col gap-4 text-gray-400">
            <a href="#home">Home</a>
            <a href="#products">Products</a>
            <a href="#about">About</a>
            <a href="#contact">Contact</a>
          </div>
        </div>


        {/* BUSINESS DETAILS */}
        <div>
          <h4 className="text-xl font-semibold mb-5">
            Business Details
          </h4>

          <div className="space-y-4 text-gray-400">
            <p>FSSAI Lic No: 22426402000209</p>

            <p>GSTIN: 33ATHPN4463C1ZW</p>

            <p>MSME Reg.No: UDYAM-TN-03-0316573</p>

            <p>
              Address: Natvian Foods, 3/147A, Chettiyar Thottam,
              Periyathottampudur, Karamadai block,
              Coimbatore, Tamil Nadu-638459
            </p>
          </div>
        </div>


        {/* FOLLOW US */}
        <div>
          <h4 className="text-xl font-semibold mb-5">
            Follow Us
          </h4>

          <div className="flex gap-5">

            {/* INSTAGRAM */}
            <div className="text-center">

              <a
                href="https://www.instagram.com/thenativefooddotcom/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow us on Instagram"
              >
                <img
                  src="/instagram-qr.jpeg"
                  alt="Instagram QR Code"
                  className="w-28 h-28 object-contain rounded-xl bg-white p-2 shadow-lg hover:scale-105 transition-transform duration-200"
                />
              </a>

              <p className="mt-2 text-sm font-semibold">
                Instagram
              </p>

            </div>


            {/* FACEBOOK */}
            <div className="text-center">

              <a
                href="https://www.facebook.com/share/1EH2tJbgwU/"
                target="_blank"
                rel="noopener noreferrer"
                title="Follow us on Facebook"
              >
                <img
                  src="/facebook-qr.png"
                  alt="Facebook QR Code"
                  className="w-28 h-28 object-contain rounded-xl bg-white p-2 shadow-lg hover:scale-105 transition-transform duration-200"
                />
              </a>

              <p className="mt-2 text-sm font-semibold">
                Facebook
              </p>

            </div>

          </div>

          <p className="text-gray-400 text-sm mt-4">
            Scan to follow us
          </p>
        </div>

      </div>


      {/* COPYRIGHT */}
      <div className="border-t border-gray-700 mt-14 pt-8 text-center text-gray-500">
        © 2026 Natvian Foods. All Rights Reserved.
      </div>

    </footer>
  );
}
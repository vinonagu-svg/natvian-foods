export default function Footer() {
  return (
    <footer className="bg-[#1f2d16] text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <h3 className="text-3xl font-bold mb-5">
            Natvian Foods
          </h3>

          <p className="text-gray-400">
            Traditional healthy foods crafted for modern wellness.
          </p>
        </div>

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

        <div>
          <h4 className="text-xl font-semibold mb-5">
            Business Details
          </h4>

          <div className="space-y-4 text-gray-400">
            <p>FSSAI Lic No: 22426402000209</p>
            <p>GSTIN: 33ATHPN4463C1ZW</p>
            <p>MSME Reg.No: UDYAM-TN-03-0316573</p>
            <p>Address: Natvain Foods, 3/147A, Chettiyar Thottam,
            Periyathottampudur, Karamadai block,
            Coimbatore, Tamil Nadu-638459</p>

          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-5">
            Follow Us
          </h4>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-[#4F772D] flex items-center justify-center">
              F
            </div>

            <div className="w-12 h-12 rounded-full bg-[#4F772D] flex items-center justify-center">
              I
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-14 pt-8 text-center text-gray-500">
        © 2026 Natvian Foods. All Rights Reserved.
      </div>
    </footer>
  )
}
export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-r from-[#31572C] to-[#4F772D] text-white py-24 px-6"
    >
      <div className="max-w-5xl mx-auto text-center">

        {/* TITLE */}
        <p className="uppercase tracking-[4px] text-[#dce8cf] font-semibold mb-5">
          Contact Us
        </p>

        <h2 className="text-5xl md:text-6xl font-bold mb-8">
          Ready To Start Your Healthy Journey?
        </h2>

        <p className="text-xl text-gray-200 mb-12">
          Contact Natvian Foods for orders and enquiries.
        </p>

        {/* CONTACT BUTTONS */}
        <div className="flex flex-wrap justify-center gap-6">

          {/* WHATSAPP */}
          <a
            href="https://wa.me/917411498799"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#31572C] px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:scale-105 transition-transform"
          >
            WhatsApp
          </a>

          {/* EMAIL */}
          <a
            href="mailto:Natvianfoods@gmail.com"
            className="border-2 border-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-white hover:text-[#31572C] transition"
          >
            Email Us
          </a>

          {/* FARM LOCATION */}
          <a
            href="https://maps.app.goo.gl/oSGbewWqgAqWeHsU6"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1B4332] border-2 border-white px-10 py-4 rounded-2xl text-lg font-bold shadow-xl hover:scale-105 transition-transform"
          >
            📍 Visit Our Farm
          </a>

        </div>

        {/* FARM LOCATION DETAILS */}
        <div className="mt-12 text-gray-200">

          <p className="text-lg font-semibold mb-2">
            📍 Natvian Foods Farm
          </p>

          <p className="text-base md:text-lg leading-relaxed">
            Periyathottampudur, Karamadai Block,
            <br />
            Coimbatore, Tamil Nadu
          </p>

          {/* MAP LINK */}
          <a
            href="https://maps.app.goo.gl/oSGbewWqgAqWeHsU6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 underline font-semibold hover:text-white transition"
          >
            View Farm Location on Google Maps →
          </a>

        </div>

      </div>
    </section>
  );
}
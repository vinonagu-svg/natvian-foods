export default function Contact() {
  return (
    <section
      id="contact"
      className="bg-gradient-to-r from-[#31572C] to-[#4F772D] text-white py-24 px-6"
    >
      <div className="max-w-5xl mx-auto text-center">
        <p className="uppercase tracking-[4px] text-[#dce8cf] font-semibold mb-5">
          Contact Us
        </p>

        <h2 className="text-5xl md:text-6xl font-bold mb-8">
          Ready To Start Your Healthy Journey?
        </h2>

        <p className="text-xl text-gray-200 mb-12">
          Contact Natvian Foods for orders and enquiries.
        </p>

        <div className="flex flex-wrap justify-center gap-6">
          <a
            href="https://wa.me/917411498799"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-[#31572C] px-10 py-4 rounded-2xl text-lg font-bold shadow-xl"
          >
            WhatsApp
          </a>

          <a
            href="mailto:Natvianfoods@gmail.com"
            className="border-2 border-white px-10 py-4 rounded-2xl text-lg font-bold"
          >
            Email Us
          </a>
        </div>
      </div>
    </section>
  )
}
import { useState } from "react"

const faqs = [
  {
    question: "Are your products natural?",
    answer:
      "Yes, Natvian Foods products are made from 100% natural ingredients with no artificial additives.",
  },
  {
    question: "Do you ship across India?",
    answer:
      "Yes, we deliver across India through trusted courier partners with safe packaging.",
  },
  {
    question: "Do products contain preservatives?",
    answer:
      "No, our products are free from artificial preservatives and chemicals.",
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null)

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold text-[#31572C] mb-5">
          Frequently Asked Questions
        </h2>
      </div>

      <div className="space-y-5">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg overflow-hidden transition-all duration-300"
          >
            {/* Question Button */}
            <button
              onClick={() => toggleFAQ(index)}
              className="w-full flex justify-between items-center p-6 text-left"
            >
              <span className="text-xl font-semibold text-[#31572C]">
                {item.question}
              </span>

              <span className="text-2xl text-[#4F772D]">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>

            {/* Answer (collapsible) */}
            <div
              className={`px-6 pb-6 text-gray-600 leading-relaxed transition-all duration-300 ease-in-out ${
                openIndex === index
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              {item.answer}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
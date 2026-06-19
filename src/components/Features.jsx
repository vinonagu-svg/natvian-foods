import {
  Leaf,
  HandHeart,
  Soup,
  Sprout,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: <Leaf size={42} strokeWidth={1.8} />,
    title: "Authentic & Natural",
  },
  {
    icon: <HandHeart size={42} strokeWidth={1.8} />,
    title: "Carefully Sourced from Trusted Producers",
  },
  {
    icon: <Soup size={42} strokeWidth={1.8} />,
    title: "Wholesome Nutrition for Every Family",
  },
  {
    icon: <Sprout size={42} strokeWidth={1.8} />,
    title: "Traditional Foods for a Healthier Lifestyle",
  },
  {
    icon: <ShieldCheck size={42} strokeWidth={1.8} />,
    title: "No Artificial Additives & No Preservatives",
  },
];

export default function Features() {
  return (
    <section
      className="py-12 border-b border-[#d8d0b8]"
      style={{
        background:
          "linear-gradient(to bottom, #f8f5ee, #f5f1e8)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">

          {benefits.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-5 min-h-[140px]"
            >
              {/* Modern Premium Icon Circle */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-white to-[#f3f6eb] border border-[#d7dfc7] shadow-lg flex items-center justify-center text-[#5B7F2A] shrink-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                {item.icon}
              </div>

              {/* Text */}
              <div className="flex items-center min-h-[100px]">
                <h3 className="text-[17px] md:text-[19px] font-semibold text-[#243424] leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
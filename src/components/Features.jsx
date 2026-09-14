import {
  Leaf,
  HandHeart,
  Soup,
  Sprout,
  ShieldCheck,
} from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "Authentic & Natural",
  },
  {
    icon: HandHeart,
    title: "Trusted Producers",
  },
  {
    icon: Soup,
    title: "Wholesome Nutrition",
  },
  {
    icon: Sprout,
    title: "Traditional Foods",
  },
  {
    icon: ShieldCheck,
    title: "No Preservatives",
  },
];

export default function Features() {
  return (
    <section
      className="border-b border-[#ddd6c5]"
      style={{
        background:
          "linear-gradient(to bottom, #faf8f2, #f6f3eb)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

          {benefits.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`
                  group
                  flex items-center justify-center
                  gap-3
                  px-4
                  py-4
                  lg:py-5
                  transition-all duration-300
                  ${
                    index !== benefits.length - 1
                      ? "lg:border-r lg:border-[#ddd6c5]"
                      : ""
                  }
                  ${
                    index < 4
                      ? "border-b md:border-b-0 border-[#ddd6c5]"
                      : ""
                  }
                `}
              >
                {/* Icon */}
                <div
                  className="
                    flex items-center justify-center
                    w-10 h-10
                    shrink-0
                    rounded-full
                    border border-[#d7dfc7]
                    bg-[#f1f5e9]
                    text-[#5B7F2A]
                    transition-all duration-300
                    group-hover:bg-[#e7efda]
                    group-hover:border-[#c8d7b2]
                    group-hover:scale-105
                  "
                >
                  <Icon
                    size={22}
                    strokeWidth={1.7}
                  />
                </div>

                {/* Text */}
                <span
                  className="
                    text-[13px]
                    sm:text-[14px]
                    lg:text-[15px]
                    font-medium
                    tracking-[-0.01em]
                    text-[#263526]
                    leading-tight
                    whitespace-nowrap
                  "
                >
                  {item.title}
                </span>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}
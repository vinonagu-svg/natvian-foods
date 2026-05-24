import product1 from "../assets/banana-bloom.webp";
import product2 from "../assets/Murunga-health-mix.webp";
import product3 from "../assets/Herbal-Tea.webp";

export const products = [
  {
    id: 1,
    name: "Banana Bloom Health Mix",
    image: product1,
    description:
      "Traditional nutritious health mix made with natural ingredients.",

    variants: [
      { weight: "100g", mrp: 99 },
      { weight: "250g", mrp: 249 },
      { weight: "500g", mrp: 499 },
      { weight: "1kg", mrp: 999 }
    ]
  },

  {
    id: 2,
    name: "Murungai Health Mix",
    image: product2,
    description:
      "Rich in nutrients and naturally prepared for daily wellness.",

    variants: [
      { weight: "100g", mrp: 99 },
      { weight: "250g", mrp: 249 },
      { weight: "500g", mrp: 499 },
      { weight: "1kg", mrp: 999 }
    ]
  },

  {
    id: 3,
    name: "Avarampoo Herbal Infusion",
    image: product3,
    description:
      "Refreshing traditional herbal drink with natural wellness benefits.",

    variants: [
      { weight: "100g", mrp: 110 },
      { weight: "250g", mrp: 275 },
      { weight: "500g", mrp: 550 },
      { weight: "1kg", mrp: 1100 }
    ]
  }
];
import grill from "@/assets/dish-grill.jpg";
import curry from "@/assets/dish-curry.jpg";
import wrap from "@/assets/dish-wrap.jpg";
import platter from "@/assets/dish-platter.jpg";
import drink from "@/assets/dish-drink.jpg";
import skewers from "@/assets/dish-skewers.jpg";
import buffet from "@/assets/buffet.jpg";

export type Category = "Grills" | "Curries" | "Wraps" | "Platters" | "Buffet" | "Drinks";

export interface Dish {
  id: string;
  name: string;
  category: Category;
  description: string;
  price: string;
  image: string;
  pairing?: string;
  serves?: string;
}

export const categories: Category[] = ["Grills", "Curries", "Wraps", "Platters", "Buffet", "Drinks"];

export const dishes: Dish[] = [
  {
    id: "whole-grilled-fish",
    name: "Whole Grilled Tilapia",
    category: "Grills",
    description: "Fresh Lake Kivu tilapia, charred over open flame, finished with citrus butter and herbs.",
    price: "18,000 RWF",
    image: grill,
    pairing: "Pairs with our Citrus Ginger Cooler",
  },
  {
    id: "flame-skewers",
    name: "Flame Beef Skewers",
    category: "Grills",
    description: "Tender beef cubes marinated 24 hours, grilled over white-oak embers.",
    price: "14,000 RWF",
    image: skewers,
    pairing: "Pairs with Tania's House Red",
  },
  {
    id: "coconut-curry",
    name: "Coconut Coastal Curry",
    category: "Curries",
    description: "Slow-simmered prawns in coconut, lemongrass and warm spices, served with naan.",
    price: "16,500 RWF",
    image: curry,
    pairing: "Pairs with Hibiscus Sparkler",
  },
  {
    id: "gourmet-wrap",
    name: "Tania's Gourmet Wrap",
    category: "Wraps",
    description: "Spinach tortilla, grilled chicken, mango, avocado, herbed feta.",
    price: "9,500 RWF",
    image: wrap,
  },
  {
    id: "grand-platter",
    name: "Grand Catering Platter",
    category: "Platters",
    description: "An abundant selection of grilled meats, skewers, sides and sauces.",
    price: "From 120,000 RWF",
    image: platter,
    serves: "8 — 12 guests",
  },
  {
    id: "daily-buffet",
    name: "Daily Lounge Buffet",
    category: "Buffet",
    description: "Rotating chef's selection — three proteins, six sides, salads & dessert.",
    price: "12,000 RWF / person",
    image: buffet,
    serves: "Lunch · 12h — 15h",
  },
  {
    id: "citrus-cooler",
    name: "Citrus Ginger Cooler",
    category: "Drinks",
    description: "Fresh lime, ginger, raw honey, soda — smoked tableside with applewood.",
    price: "5,500 RWF",
    image: drink,
  },
];

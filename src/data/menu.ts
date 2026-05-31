import grill from "@/assets/dish-grill.jpg";
import curry from "@/assets/dish-curry.jpg";
import wrap from "@/assets/dish-wrap.jpg";
import platter from "@/assets/dish-platter.jpg";
import drink from "@/assets/dish-drink.jpg";
import skewers from "@/assets/dish-skewers.jpg";
import buffet from "@/assets/buffet.jpg";

export interface MenuItem {
  name: string;
  price: string;
  description?: string;
  note?: string;
}

export interface MenuGroup {
  name: string;
  items: MenuItem[];
}

export interface SpecialBox {
  title: string;
  items: MenuItem[];
}

export interface MenuSection {
  id: string;
  category: string;
  title: string;
  subtitle: string;
  image: string;
  items?: MenuItem[];
  groups?: MenuGroup[];
  special_box?: SpecialBox;
  compact?: boolean;
}

export const restaurantInfo = {
  name: "TANIA'S",
  subtitle: "Cuisine & Lounge",
  tagline: "A Culinary Journey of African Flavors",
  est: "2018",
  currency: "FRW",
  currency_note:
    "All prices are in Rwandan Francs (FRW) and inclusive of applicable taxes",
};

export const menuSections: MenuSection[] = [
  {
    id: "snacks-starters",
    category: "Begin Your Journey",
    title: "Snacks & Starters",
    subtitle: "Perfect beginnings to your dining experience",
    image: skewers,
    items: [
      { name: "Snacks Platter", price: "25,000 FRW", note: "Preparation: 45 min" },
      { name: "BBQ Platter", price: "75,000 FRW", note: "Preparation: 1 hour" },
      { name: "Plate of Samosas", price: "8,000 FRW" },
      { name: "Cheese Platter", price: "8,000 FRW" },
      { name: "Cheese & Sausages", price: "10,000 FRW" },
      { name: "Chicken Nuggets", price: "12,000 FRW" },
      { name: "Chicken Lollipops", price: "12,000 FRW" },
      { name: "Fish Fingers", price: "12,000 FRW" },
    ],
  },
  {
    id: "soups-salads",
    category: "Fresh & Wholesome",
    title: "Soups & Salads",
    subtitle: "Garden-fresh ingredients, crafted with care",
    image: wrap,
    items: [
      { name: "Vegetable Soup", price: "8,000 FRW" },
      { name: "Mushroom Soup", price: "12,000 FRW" },
      { name: "Cream Tomato Soup", price: "12,000 FRW" },
      { name: "Ginger Carrot Soup", price: "12,000 FRW" },
      { name: "Kachumbari", price: "5,000 FRW" },
      {
        name: "Garden Salad",
        price: "6,000 FRW",
        description: "Cucumbers, tomatoes, lettuces, onions, avocadoes",
      },
      { name: "Chicken Salad", price: "10,000 FRW" },
      { name: "Chef Salad", price: "12,000 FRW" },
    ],
  },
  {
    id: "beef-pork",
    category: "From the Grill",
    title: "Beef & Pork",
    subtitle: "Prime cuts, expertly seasoned and grilled to perfection",
    image: grill,
    groups: [
      {
        name: "Beef",
        items: [
          { name: "Twatundi Beef", price: "18,000 FRW" },
          { name: "Beef Brochettes", price: "18,000 FRW" },
          { name: "Sizzling Twatundi Beef", price: "18,000 FRW" },
          { name: "Beef Stew", price: "15,000 FRW" },
          {
            name: "Beef Fillet Steak",
            price: "25,000 FRW",
            description: "Mushroom sauce, peppercorn sauce, or garlic sauce",
          },
        ],
      },
      {
        name: "Pork",
        items: [
          { name: "Twatundi Pork", price: "18,000 FRW" },
          { name: "Fresh Sausage Brochette", price: "10,000 FRW" },
          { name: "Saucisse Pili Brochette", price: "10,000 FRW" },
          { name: "Pork Chops", price: "20,000 FRW" },
          { name: "Pork Ribs", price: "15,000 FRW" },
        ],
      },
    ],
  },
  {
    id: "goat-specialties",
    category: "Traditional Favorites",
    title: "Goat Specialties",
    subtitle: "Authentic African goat preparations",
    image: platter,
    items: [
      { name: "Twatundi Goat", price: "18,000 FRW" },
      { name: "Sizzling Twatundi Goat", price: "18,000 FRW" },
      { name: "Chèvre de Mr Seguin", price: "22,000 FRW", note: "Preparation: 40 min" },
      { name: "Ragoût de Chèvre", price: "22,000 FRW", note: "Preparation: 40 min" },
      { name: "Chèvre Grillé", price: "18,000 FRW" },
      { name: "Cabri", price: "25,000 FRW" },
    ],
    special_box: {
      title: "Chef's Special Menu",
      items: [
        { name: "Poulet Gombo", price: "25,000 FRW", note: "Preparation: 45 min" },
        { name: "Poulet Maffé", price: "25,000 FRW", note: "Preparation: 45 min" },
      ],
    },
  },
  {
    id: "chicken",
    category: "Poultry Perfection",
    title: "Chicken",
    subtitle: "From the grill to your plate, succulent and flavorful",
    image: skewers,
    items: [
      { name: "Twatundi Chicken", price: "15,000 FRW" },
      { name: "Chicken Brochette", price: "15,000 FRW" },
      { name: "1/4 Grilled Chicken", price: "15,000 FRW" },
      { name: "1/2 Grilled Chicken", price: "18,000 FRW" },
      { name: "Whole Grilled Chicken", price: "25,000 FRW", note: "Preparation: 50 min" },
      { name: "Chicken Yassa", price: "25,000 FRW" },
      {
        name: "Chicken with Peanut Sauce",
        price: "20,000 FRW",
        description: "Poulet à la sauce arachide",
        note: "Preparation: 1 hour",
      },
      { name: "Chicken Stroganoff", price: "18,000 FRW" },
      { name: "Poulet Mayo", price: "20,000 FRW" },
      { name: "Peri Peri 1/4 Chicken", price: "18,000 FRW" },
      { name: "Chicken Stew", price: "18,000 FRW" },
    ],
  },
  {
    id: "fish",
    category: "Fresh Catch",
    title: "Fish",
    subtitle: "Ocean-fresh flavors from the lake to your table",
    image: curry,
    items: [
      { name: "Fish Brochette", price: "18,000 FRW" },
      {
        name: "Fish Fillet",
        price: "22,000 FRW",
        description: "Served with your choice of sauce",
      },
      { name: "Twatundi Fish", price: "18,000 FRW" },
      {
        name: "Tilapia Fillet",
        price: "22,000 FRW",
        description: "With lemon butter sauce",
        note: "Preparation: 1 hour",
      },
      {
        name: "Swahili Fish",
        price: "22,000 FRW",
        description: "With coconut sauce",
      },
      { name: "Whole Tilapia Fish", price: "25,000 FRW", note: "Preparation: 1 hour" },
      { name: "Makayabu Stew", price: "20,000 FRW" },
    ],
  },
  {
    id: "extras-sides",
    category: "Accompaniments",
    title: "Extras & Sides",
    subtitle: "The perfect complement to your main course",
    image: buffet,
    compact: true,
    items: [
      { name: "Plate of Sombe", price: "4,000" },
      { name: "Lengalenga", price: "3,000" },
      { name: "Lengalenga with Smoked Fish", price: "5,000" },
      { name: "Spinach", price: "4,000" },
      { name: "Spinach with Cream", price: "8,000" },
      { name: "Fumbwa", price: "20,000" },
      { name: "Beans", price: "3,000" },
      { name: "Haricots de Goma", price: "5,000" },
      { name: "Steamed Rice", price: "3,000" },
      { name: "Fried Rice", price: "6,000" },
      { name: "Chicken Fried Rice", price: "8,000" },
      { name: "Kwanga", price: "2,500" },
      { name: "Plantain", price: "4,000" },
      { name: "Chips", price: "3,500" },
      { name: "Fried Bananas", price: "3,000" },
      { name: "Grilled Bananas", price: "3,000" },
      { name: "Boiled Potatoes", price: "3,000" },
      { name: "Garlic Potatoes", price: "4,500" },
      { name: "Sombe (2kg)", price: "15,000" },
      { name: "Cassava Ugali", price: "3,000" },
      { name: "Maize Ugali", price: "3,000" },
      { name: "Ugali Mix", price: "4,000" },
    ],
  },
  {
    id: "coffee-tea",
    category: "The Coffee Bar",
    title: "Coffee & Tea",
    subtitle: "Artisan brews and aromatic blends",
    image: drink,
    compact: true,
    groups: [
      {
        name: "Hot Coffee",
        items: [
          { name: "Espresso (Single)", price: "2,500" },
          { name: "Espresso (Double)", price: "3,000" },
          { name: "Macchiato", price: "3,000" },
          { name: "Americano", price: "4,000" },
          { name: "Caffé Latte", price: "4,000" },
          { name: "Cappuccino", price: "4,000" },
          { name: "Flat White", price: "4,000" },
          { name: "Spanish Coffee", price: "5,000" },
          { name: "Mocha", price: "5,000" },
          { name: "Caramel Macchiato", price: "5,000" },
          { name: "Hot Chocolate", price: "5,000" },
          { name: "Tania's Coffee", price: "6,000" },
          { name: "Customer Choice", price: "8,000" },
        ],
      },
      {
        name: "Iced Coffee",
        items: [
          { name: "Iced Cappuccino", price: "5,000" },
          { name: "Iced Latte", price: "5,000" },
          { name: "Iced Americano", price: "5,000" },
          { name: "Iced Mocha", price: "6,000" },
          { name: "Iced Tea", price: "5,000" },
          { name: "Iced Caramel", price: "6,000" },
          { name: "Iced Chocolate", price: "6,000" },
          { name: "Iced Espresso Tonic", price: "5,000" },
          { name: "Iced Spanish", price: "8,000" },
          { name: "Customer Choice", price: "8,000" },
        ],
      },
      {
        name: "Tea",
        items: [
          { name: "African Tea", price: "6,000" },
          { name: "Spice Tea", price: "6,000" },
          { name: "Green Tea", price: "4,000" },
          { name: "Black Tea", price: "3,500" },
          { name: "Lemon Tea", price: "3,500" },
        ],
      },
    ],
  },
  {
    id: "smoothies-juices",
    category: "Refreshing Sips",
    title: "Smoothies & Juices",
    subtitle: "Nature's sweetness in every glass",
    image: drink,
    groups: [
      {
        name: "Smoothies",
        items: [
          { name: "Mango Smoothie", price: "10,000" },
          { name: "Banana Smoothie", price: "10,000" },
          { name: "Mix Smoothie", price: "10,000" },
          { name: "Avocado Smoothie", price: "10,000" },
          { name: "Customer Choice", price: "12,000" },
        ],
      },
      {
        name: "Fresh Juices",
        items: [
          { name: "Pineapple Juice", price: "8,000" },
          { name: "Passion Juice", price: "8,000" },
          { name: "Tree Tomato Juice", price: "8,000" },
          { name: "Lemon Juice", price: "8,000" },
          { name: "Mango Juice", price: "10,000" },
          { name: "Pure Lemonade", price: "8,000" },
        ],
      },
      {
        name: "Milkshakes",
        items: [
          { name: "Vanilla Shake", price: "8,000" },
          { name: "Chocolate Shake", price: "8,000" },
          { name: "Oreo Shake", price: "10,000" },
          { name: "Espresso Shake", price: "8,000" },
          { name: "Tropical Shake", price: "8,000" },
          { name: "Strawberry Shake", price: "8,000" },
          { name: "Customer Choice", price: "10,000" },
        ],
      },
      {
        name: "Ice Cream",
        items: [
          { name: "1 Scoop", price: "3,000" },
          { name: "2 Scoops", price: "6,000" },
        ],
      },
    ],
  },
];

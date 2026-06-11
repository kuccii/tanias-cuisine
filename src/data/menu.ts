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
  subtitle: "Food & Coffee",
  tagline: "A Culinary Journey of African Flavors",
  est: "2026",
  address: "M&M Plaza, Gishushu, Kigali",
  phone: "+250 788 500 635",
  currency: "FRW",
  currency_note:
    "All prices are in Rwandan Francs (FRW) and inclusive of applicable taxes",
};

const W = "wa.me";
const P = "250788500635";

export function waOrderUrl(name: string) {
  return `https://${W}/${P}?text=I'd%20like%20to%20order%3A%20${encodeURIComponent(name)}`;
}

export const menuSections: MenuSection[] = [
  {
    id: "snacks-starters",
    category: "Begin Your Journey",
    title: "Snacks & Starters",
    subtitle: "Perfect beginnings to your dining experience",
    image: skewers,
    items: [
      { name: "Snacks Platter", price: "25,000 FRW", note: "Preparation: 45 min", description: "A generous selection of our finest finger foods — perfect for sharing" },
      { name: "BBQ Platter", price: "75,000 FRW", note: "Preparation: 1 hour", description: "A smoky feast of grilled meats and accompaniments" },
      { name: "Plate of Samosas", price: "8,000 FRW", description: "Crispy, golden triangles filled with spiced meat and herbs" },
      { name: "Cheese Platter", price: "8,000 FRW", description: "A curated selection of cheeses served with crackers and chutney" },
      { name: "Cheese & Sausages", price: "10,000 FRW", description: "Sliced cheeses paired with grilled sausages" },
      { name: "Chicken Nuggets", price: "12,000 FRW", description: "Golden-fried bite-sized chicken, crispy outside and tender within" },
      { name: "Chicken Lollipops", price: "12,000 FRW", description: "Marinated chicken drumettes, glazed and oven-roasted" },
      { name: "Fish Fingers", price: "12,000 FRW", description: "Lightly battered fish strips, fried to a golden crisp" },
    ],
  },
  {
    id: "soups-salads",
    category: "Fresh & Wholesome",
    title: "Soups & Salads",
    subtitle: "Garden-fresh ingredients, crafted with care",
    image: wrap,
    items: [
      { name: "Vegetable Soup", price: "8,000 FRW", description: "A warming medley of seasonal vegetables in a light broth" },
      { name: "Mushroom Soup", price: "12,000 FRW", description: "Velvety cream of mushroom with earthy undertones" },
      { name: "Cream Tomato Soup", price: "12,000 FRW", description: "Rich and smooth tomato bisque with a hint of basil" },
      { name: "Ginger Carrot Soup", price: "12,000 FRW", description: "Sweet carrots blended with warming ginger" },
      { name: "Kachumbari", price: "5,000 FRW", description: "Fresh tomato and onion salad with citrus dressing — an East African classic" },
      {
        name: "Garden Salad",
        price: "6,000 FRW",
        description: "Cucumbers, tomatoes, lettuces, onions, avocadoes",
      },
      { name: "Chicken Salad", price: "10,000 FRW", description: "Tender chicken strips over crisp greens with your choice of dressing" },
      { name: "Chef Salad", price: "12,000 FRW", description: "A hearty salad with egg, cheese, ham, and fresh garden vegetables" },
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
          { name: "Twatundi Beef", price: "18,000 FRW", description: "Tender beef medallions pan-seared in a rich signature sauce" },
          { name: "Beef Brochettes", price: "18,000 FRW", description: "Skewered beef cubes flame-grilled over charcoal" },
          { name: "Sizzling Twatundi Beef", price: "18,000 FRW", description: "Twatundi beef served on a sizzling hot plate with sautéed vegetables" },
          { name: "Beef Stew", price: "15,000 FRW", description: "Slow-cooked beef in a hearty tomato-onion gravy" },
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
          { name: "Twatundi Pork", price: "18,000 FRW", description: "Succulent pork cooked in our signature Twatundi sauce" },
          { name: "Fresh Sausage Brochette", price: "10,000 FRW", description: "House-made sausages skewered and grilled" },
          { name: "Saucisse Pili Brochette", price: "10,000 FRW", description: "Spiced sausage brochette with a pili-pili kick" },
          { name: "Pork Chops", price: "20,000 FRW", description: "Thick-cut pork chops, seasoned and grilled" },
          { name: "Pork Ribs", price: "15,000 FRW", description: "Fall-off-the-bone ribs basted in smoky barbecue glaze" },
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
      { name: "Twatundi Goat", price: "18,000 FRW", description: "Tender goat meat simmered in our signature Twatundi sauce" },
      { name: "Sizzling Twatundi Goat", price: "18,000 FRW", description: "Twatundi goat served sizzling on a hot plate" },
      { name: "Chèvre de Mr Seguin", price: "22,000 FRW", note: "Preparation: 40 min", description: "A tender goat stew named after the beloved French tale" },
      { name: "Ragoût de Chèvre", price: "22,000 FRW", note: "Preparation: 40 min", description: "Hearty goat ragout slow-cooked with root vegetables and herbs" },
      { name: "Chèvre Grillé", price: "18,000 FRW", description: "Grilled goat chops seasoned with aromatic spices" },
      { name: "Cabri", price: "25,000 FRW", description: "Whole young goat roasted to perfection — a feast for special occasions" },
    ],
    special_box: {
      title: "Chef's Special Menu",
      items: [
        { name: "Poulet Gombo", price: "25,000 FRW", note: "Preparation: 45 min", description: "Chicken stewed with okra in a spiced tomato sauce" },
        { name: "Poulet Maffé", price: "25,000 FRW", note: "Preparation: 45 min", description: "Chicken simmered in a rich peanut butter sauce" },
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
      { name: "Twatundi Chicken", price: "15,000 FRW", description: "Chicken pieces simmered in our signature Twatundi sauce" },
      { name: "Chicken Brochette", price: "15,000 FRW", description: "Marinated chicken skewers grilled over charcoal" },
      { name: "1/4 Grilled Chicken", price: "15,000 FRW", description: "Quarter chicken marinated and flame-grilled" },
      { name: "1/2 Grilled Chicken", price: "18,000 FRW", description: "Half chicken marinated and flame-grilled" },
      { name: "Whole Grilled Chicken", price: "25,000 FRW", note: "Preparation: 50 min", description: "Whole chicken marinated and flame-grilled to perfection" },
      { name: "Chicken Yassa", price: "25,000 FRW", description: "Marinated chicken simmered with caramelized onions and mustard" },
      {
        name: "Chicken with Peanut Sauce",
        price: "20,000 FRW",
        description: "Poulet à la sauce arachide",
        note: "Preparation: 1 hour",
      },
      { name: "Chicken Stroganoff", price: "18,000 FRW", description: "Tender chicken in a creamy mushroom and sour cream sauce" },
      { name: "Poulet Mayo", price: "20,000 FRW", description: "Grilled chicken topped with house-made mayonnaise and fresh herbs" },
      { name: "Peri Peri 1/4 Chicken", price: "18,000 FRW", description: "Quarter chicken basted in fiery peri-peri sauce" },
      { name: "Chicken Stew", price: "18,000 FRW", description: "Hearty chicken simmered in a rich tomato and onion gravy" },
    ],
  },
  {
    id: "fish",
    category: "Fresh Catch",
    title: "Fish",
    subtitle: "Ocean-fresh flavors from the lake to your table",
    image: curry,
    items: [
      { name: "Fish Brochette", price: "18,000 FRW", description: "Fresh fish fillets skewered and grilled over charcoal" },
      {
        name: "Fish Fillet",
        price: "22,000 FRW",
        description: "Served with your choice of sauce",
      },
      { name: "Twatundi Fish", price: "18,000 FRW", description: "Fish fillets simmered in our signature Twatundi sauce" },
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
      { name: "Whole Tilapia Fish", price: "25,000 FRW", note: "Preparation: 1 hour", description: "A whole tilapia fried or grilled, served with sides" },
      { name: "Makayabu Stew", price: "20,000 FRW", description: "Dried salted fish slow-cooked in a flavorful tomato and onion stew" },
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
      { name: "Plate of Sombe", price: "4,000", description: "Mildly flavoured cassava leaves cooked to perfection" },
      { name: "Lengalenga", price: "3,000", description: "Sautéed greens with onion and a hint of spice" },
      { name: "Lengalenga with Smoked Fish", price: "5,000", description: "Sautéed greens enriched with smoky fish flavour" },
      { name: "Spinach", price: "4,000", description: "Fresh spinach gently wilted and seasoned" },
      { name: "Spinach with Cream", price: "8,000", description: "Velvety creamed spinach" },
      { name: "Fumbwa", price: "20,000", description: "A traditional wild green delicacy cooked in groundnut sauce" },
      { name: "Beans", price: "3,000", description: "Slow-cooked beans in a light sauce" },
      { name: "Haricots de Goma", price: "5,000", description: "Beans from Goma, cooked with palm oil and spices" },
      { name: "Steamed Rice", price: "3,000", description: "Fluffy steamed white rice" },
      { name: "Fried Rice", price: "6,000", description: "Wok-fried rice with vegetables and soy" },
      { name: "Chicken Fried Rice", price: "8,000", description: "Fried rice with tender chicken pieces" },
      { name: "Kwanga", price: "2,500", description: "Fermented cassava roll — a Central African staple" },
      { name: "Plantain", price: "4,000", description: "Sweet fried plantain slices" },
      { name: "Chips", price: "3,500", description: "Golden french fries" },
      { name: "Fried Bananas", price: "3,000", description: "Ripe bananas pan-fried until caramelised" },
      { name: "Grilled Bananas", price: "3,000", description: "Bananas grilled and glazed" },
      { name: "Boiled Potatoes", price: "3,000", description: "Simply boiled and lightly salted" },
      { name: "Garlic Potatoes", price: "4,500", description: "Roasted potatoes tossed in garlic and herbs" },
      { name: "Sombe (2kg)", price: "15,000", description: "A generous family portion of cassava leaves" },
      { name: "Cassava Ugali", price: "3,000", description: "Stiff cassava flour dough — a classic pairing" },
      { name: "Maize Ugali", price: "3,000", description: "Stiff maize flour dough — a classic pairing" },
      { name: "Ugali Mix", price: "4,000", description: "Cassava and maize ugali blended" },
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
          { name: "Espresso (Single)", price: "2,500", description: "A single shot of our signature espresso" },
          { name: "Espresso (Double)", price: "3,000", description: "A double shot for a bolder kick" },
          { name: "Macchiato", price: "3,000", description: "Espresso with a touch of steamed milk" },
          { name: "Americano", price: "4,000", description: "Espresso lengthened with hot water" },
          { name: "Caffé Latte", price: "4,000", description: "Espresso with steamed milk and a light foam" },
          { name: "Cappuccino", price: "4,000", description: "Espresso with equal parts steamed milk and froth" },
          { name: "Flat White", price: "4,000", description: "Espresso with velvety microfoam" },
          { name: "Spanish Coffee", price: "5,000", description: "Coffee with condensed milk for a sweet finish" },
          { name: "Mocha", price: "5,000", description: "Espresso with chocolate and steamed milk" },
          { name: "Caramel Macchiato", price: "5,000", description: "Espresso with caramel and steamed milk" },
          { name: "Hot Chocolate", price: "5,000", description: "Rich creamy hot chocolate" },
          { name: "Tania's Coffee", price: "6,000", description: "Our signature house blend" },
          { name: "Customer Choice", price: "8,000", description: "Customise your perfect brew" },
        ],
      },
      {
        name: "Iced Coffee",
        items: [
          { name: "Iced Cappuccino", price: "5,000", description: "Chilled cappuccino over ice" },
          { name: "Iced Latte", price: "5,000", description: "Espresso and chilled milk over ice" },
          { name: "Iced Americano", price: "5,000", description: "Espresso over ice topped with water" },
          { name: "Iced Mocha", price: "6,000", description: "Chocolate and espresso over ice" },
          { name: "Iced Tea", price: "5,000", description: "Chilled black tea with lemon" },
          { name: "Iced Caramel", price: "6,000", description: "Caramel and espresso over ice" },
          { name: "Iced Chocolate", price: "6,000", description: "Chilled creamy chocolate" },
          { name: "Iced Espresso Tonic", price: "5,000", description: "Espresso with tonic water over ice" },
          { name: "Iced Spanish", price: "8,000", description: "Spanish coffee chilled over ice" },
          { name: "Customer Choice", price: "8,000", description: "Customise your iced brew" },
        ],
      },
      {
        name: "Tea",
        items: [
          { name: "African Tea", price: "6,000", description: "Spiced chai with milk" },
          { name: "Spice Tea", price: "6,000", description: "Aromatic blend of warming spices" },
          { name: "Green Tea", price: "4,000", description: "Pure and soothing green tea" },
          { name: "Black Tea", price: "3,500", description: "Classic black tea" },
          { name: "Lemon Tea", price: "3,500", description: "Black tea with fresh lemon" },
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
          { name: "Mango Smoothie", price: "10,000", description: "Blended ripe mango with yoghurt" },
          { name: "Banana Smoothie", price: "10,000", description: "Creamy banana blended with milk" },
          { name: "Mix Smoothie", price: "10,000", description: "A medley of seasonal fruits blended smooth" },
          { name: "Avocado Smoothie", price: "10,000", description: "Rich and creamy avocado blended with milk" },
          { name: "Customer Choice", price: "12,000", description: "Pick your fruits and we blend" },
        ],
      },
      {
        name: "Fresh Juices",
        items: [
          { name: "Pineapple Juice", price: "8,000", description: "Freshly pressed pineapple juice" },
          { name: "Passion Juice", price: "8,000", description: "Tropical passion fruit juice" },
          { name: "Tree Tomato Juice", price: "8,000", description: "Sweet and tangy tamarillo juice" },
          { name: "Lemon Juice", price: "8,000", description: "Freshly squeezed lemon juice" },
          { name: "Mango Juice", price: "10,000", description: "Fresh mango purée" },
          { name: "Pure Lemonade", price: "8,000", description: "Classic lemonade with a hint of sweetness" },
        ],
      },
      {
        name: "Milkshakes",
        items: [
          { name: "Vanilla Shake", price: "8,000", description: "Creamy vanilla milkshake" },
          { name: "Chocolate Shake", price: "8,000", description: "Rich chocolate milkshake" },
          { name: "Oreo Shake", price: "10,000", description: "Oreo cookie milkshake" },
          { name: "Espresso Shake", price: "8,000", description: "Coffee-infused milkshake" },
          { name: "Tropical Shake", price: "8,000", description: "Blended tropical fruits with milk" },
          { name: "Strawberry Shake", price: "8,000", description: "Sweet strawberry milkshake" },
          { name: "Customer Choice", price: "10,000", description: "Build your own shake" },
        ],
      },
      {
        name: "Ice Cream",
        items: [
          { name: "1 Scoop", price: "3,000", description: "A single scoop of creamy ice cream" },
          { name: "2 Scoops", price: "6,000", description: "Two scoops of your favourite flavours" },
        ],
      },
    ],
  },
];

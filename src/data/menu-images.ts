import coffee from "@/assets/dish-coffee.jpg";
import juice from "@/assets/dish-juice.jpg";
import smoothie from "@/assets/dish-smoothie.jpg";
import icecream from "@/assets/dish-icecream.jpg";
import soup from "@/assets/dish-soup.jpg";
import salad from "@/assets/dish-salad.jpg";
import samosa from "@/assets/dish-samosa.jpg";
import platter from "@/assets/dish-platter.jpg";
import goat from "@/assets/dish-goat.jpg";
import fish from "@/assets/dish-fish.jpg";
import grill from "@/assets/dish-grill.jpg";
import skewers from "@/assets/dish-skewers.jpg";
import wrap from "@/assets/dish-wrap.jpg";
import sides from "@/assets/dish-sides.jpg";
import drink from "@/assets/dish-drink.jpg";
import curry from "@/assets/dish-curry.jpg";

export function resolveItemImage(name: string, sectionId: string, groupName?: string): string {
  const n = name.toLowerCase();
  const g = (groupName ?? "").toLowerCase();

  // Drinks first — most specific keywords
  if (/(espresso|macchiato|americano|latte|cappuccino|mocha|flat white|spanish|hot chocolate|tania's coffee)/.test(n) && !n.includes("iced") && !n.includes("shake")) return coffee;
  if (n.includes("iced") || n.includes("coffee")) return coffee;
  if (n.includes("tea")) return coffee;
  if (n.includes("shake") || n.includes("milkshake")) return smoothie;
  if (n.includes("smoothie")) return smoothie;
  if (n.includes("juice") || n.includes("lemonade")) return juice;
  if (n.includes("scoop") || n.includes("ice cream")) return icecream;
  if (g === "ice cream") return icecream;

  // Food categories
  if (n.includes("soup")) return soup;
  if (n.includes("salad") || n.includes("kachumbari")) return salad;
  if (/(samosa|nugget|lollipop|finger|cheese|sausage)/.test(n) && sectionId === "snacks-starters") return samosa;
  if (n.includes("platter") || n.includes("bbq")) return platter;

  if (sectionId === "goat-specialties" || g === "goat" || /(goat|ch[èe]vre|cabri)/.test(n)) return goat;
  if (sectionId === "fish" || /(fish|tilapia|swahili|makayabu)/.test(n)) return fish;
  if (sectionId === "chicken" || /(chicken|poulet|peri peri)/.test(n)) return skewers;
  if (g === "beef" || /(beef|steak|brochette)/.test(n)) return grill;
  if (g === "pork" || /(pork|sausage|saucisse)/.test(n)) return grill;
  if (n.includes("wrap")) return wrap;

  if (sectionId === "extras-sides") return sides;

  // Coffee bar section fallback
  if (sectionId === "coffee-tea") return coffee;
  if (sectionId === "smoothies-juices") return drink;

  return curry;
}

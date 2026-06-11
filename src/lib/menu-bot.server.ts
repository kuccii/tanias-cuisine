import { menuSections, restaurantInfo } from "@/data/menu";

interface MenuItem {
  name: string;
  price: string;
  description?: string;
  note?: string;
}

function findItem(name: string): { section: string; item: MenuItem } | null {
  for (const s of menuSections) {
    for (const item of s.items ?? []) {
      if (item.name.toLowerCase().includes(name)) return { section: s.title, item };
    }
    for (const g of s.groups ?? []) {
      for (const item of g.items) {
        if (item.name.toLowerCase().includes(name)) return { section: `${s.title} > ${g.name}`, item };
      }
    }
    if (s.special_box) {
      for (const item of s.special_box.items) {
        if (item.name.toLowerCase().includes(name)) return { section: s.special_box.title, item };
      }
    }
  }
  return null;
}

const FACTS = [
  `**${restaurantInfo.name} ${restaurantInfo.subtitle}** — part of Tany's Ltd (est. 2018), serving Kigali since February 2020.`,
  `📍 M&M Plaza, Gishushu, Kigali, Rwanda`,
  `🕐 Mon–Sun · 11:00 – 23:00  (Daily buffet 12:00 – 15:00)`,
  `📞 +250 789 289 450 (Phone / WhatsApp)`,
  `✉️ hello@taniascuisine.rw · info@taniascuisine.rw · events@taniascuisine.rw`,
  `👥 Capacity: up to 1,000 guests per event`,
  `🏢 Trusted by: Access Bank, The New Times, SONARWA, GIZ, Vivo Energy/Engen Rwanda, Oxfam, Horizon Group, Bank of Kigali`,
];

function lower(input: string) {
  return input.toLowerCase().replace(/[^\w\s]/g, " ");
}

export function generateResponse(input: string): string {
  const q = lower(input);

  if (q.includes("hello") || q.includes("hi ") || q.includes("hey ") || q.includes("good morning") || q.includes("good evening") || q === "hi") {
    return `Welcome to **${restaurantInfo.name} ${restaurantInfo.subtitle}**! I'm Aroma, your menu concierge. I can help with:\n\n• Menu recommendations — tell me your cravings or budget\n• Dietary needs — vegetarian, no pork, spice level\n• Reservations & catering\n• Hours, location & contact\n\nWhat can I help you with?`;
  }

  if (q.includes("thank")) {
    return "You're very welcome! If you need anything else about the menu, reservations, or catering, I'm here to help. Enjoy your experience at Tania's! 😊";
  }

  if (q.includes("hour") || q.includes("open") || q.includes("close") || q.includes("when") || q.includes("time")) {
    return `We're open **Mon–Sun, 11:00 – 23:00**. The daily buffet runs **12:00 – 15:00** (12,000 RWF).\n\n📍 ${FACTS[1]}`;
  }

  if (q.includes("address") || q.includes("location") || q.includes("where") || q.includes("find") || q.includes("map") || q.includes("gishushu") || q.includes("come")) {
    return `We're located at **M&M Plaza, Gishushu, Kigali, Rwanda**.\n\n🕐 Mon–Sun, 11:00 – 23:00\n📞 +250 789 289 450\n\nYou can find us on Google Maps — just search "Tania's Cuisine & Lounge Gishushu".`;
  }

  if (q.includes("phone") || q.includes("call") || q.includes("whatsapp") || q.includes("contact") || q.includes("number") || q.includes("reach")) {
    return `You can reach us at:\n\n📞 **+250 789 289 450** (Phone / WhatsApp)\n✉️ hello@taniascuisine.rw (general)\n✉️ info@taniascuisine.rw\n✉️ events@taniascuisine.rw (catering)`;
  }

  if (q.includes("email") || q.includes("mail")) {
    return `Our email addresses:\n\n• **hello@taniascuisine.rw** — general inquiries\n• **info@taniascuisine.rw** — information\n• **events@taniascuisine.rw** — catering & events`;
  }

  if (q.includes("reserve") || q.includes("book") || q.includes("table") || q.includes("reservation")) {
    return `To book a table, visit our **Reservation page** at /contact. Choose your date, time, and party size — we'll confirm by WhatsApp within minutes.\n\nOr simply WhatsApp us at **+250 789 289 450** and we'll help you right away!`;
  }

  if (q.includes("cater") || q.includes("event") || q.includes("party") || q.includes("wedding") || q.includes("corporate") || q.includes("gala") || q.includes("buffet")) {
    return `Our catering service handles **50 – 1,000 guests** across four formats:\n\n1. **Corporate Catering** — working lunches, conferences (30–300 guests)\n2. **Weddings & Galas** — full-day catering (100–1,000 guests)\n3. **Private Events** — birthdays, intimate gatherings (from 20 guests)\n4. **Daily Buffet Delivery** — recurring office buffets (from 25 guests/day)\n\nTrusted by **Access Bank, The New Times, SONARWA, GIZ, Vivo Energy, Oxfam, Horizon Group, and Bank of Kigali**.\n\nVisit /catering to plan your event — our team responds within 24 hours.`;
  }

  if (q.includes("vegetarian") || q.includes("vegan") || q.includes("no meat") || q.includes("veg ")) {
    return `We have great vegetarian options! Try our:\n\n• **Vegetable Soup** — hearty and fresh\n• **Garden Salad** — crisp, seasonal greens\n• **Creamed Spinach** — rich and savoury\n• **Kachumbari** — fresh tomato & onion salad\n• **Daily Buffet** (12,000 RWF) — always features vegetarian selections\n\nMost mains can be adapted — just let your server know. For vegan options, our salads, soups, and vegetable sides are excellent choices.`;
  }

  if (q.includes("budget") || q.includes("cheap") || q.includes("affordable") || q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("expensive") || q.includes("cheapest")) {
    return `You can enjoy Tania's at any budget:\n\n**Budget-friendly:**\n• Daily Buffet — **12,000 RWF** (Mon–Sun, 12:00–15:00)\n• Samosas — **8,000 RWF**\n• Cheese Platter — **8,000 RWF**\n• Swahili Fish — **12,000 RWF**\n\n**Mid-range:**\n• Peri-Peri Chicken — **15,000 RWF**\n• Beef Fillet Steak — from **15,000 RWF**\n• Mixed Grills — **20,000 – 35,000 RWF**\n\n**For groups:**\n• BBQ Platter (serves ~4) — **75,000 RWF**\n• Snacks Platter (serves ~4) — **25,000 RWF**\n\nAll prices in RWF, taxes included. Want me to build you a full meal plan? Just tell me your budget and party size!`;
  }

  if (q.includes("spicy") || q.includes("spice") || q.includes("hot ") || q.includes("pepper")) {
    return "**Peri-Peri Chicken** (15,000 RWF) is our spiciest dish — marinated in peri-peri sauce and grilled. **Poulet à la Moambé** (18,000 RWF) has a rich, mildly spiced peanut and palm nut sauce. Most dishes can be adjusted to your preferred spice level — just ask your server!";
  }

  if (q.includes("dessert") || q.includes("sweet") || q.includes("cake") || q.includes("ice cream") || q.includes("chocolate") || q.includes("after")) {
    return `For dessert we have:\n\n• **Ice Cream** (vanilla, chocolate, strawberry) — **5,000 RWF**\n• **Grilled Bananas with Honey** — **6,000 RWF**\n• Check with your server for the dessert of the day!\n\nPair with a **Coffee**: Espresso (3,500 RWF), Cappuccino (4,500 RWF), or an African Tea (3,000 RWF).`;
  }

  if (q.includes("drink") || q.includes("cocktail") || q.includes("beer") || q.includes("wine") || q.includes("juice") || q.includes("coffee") || q.includes("tea") || q.includes("smoothie") || q.includes("soda")) {
    return `Our drinks selection:\n\n**Coffee:** Espresso (3,500 RWF), Cappuccino (4,500 RWF), Latte (5,000 RWF), African Tea (3,000 RWF)\n\n**Juices & Smoothies:** Fresh juices (4,000 RWF), Smoothies (4,500 RWF) — mango, passion, pineapple, avocado, tree tomato, and more\n\n**Specialty Drinks:** Belgian Chocolate (5,000 RWF), Iced Coffee (4,500 RWF), Milkshakes (5,000 RWF) — vanilla, chocolate, strawberry, oreo, tropical\n\n**Beers & Wine:** Ask your server for our current beer and wine selection!`;
  }

  if (q.includes("buffet") && !q.includes("cater")) {
    return `Our **Daily Lounge Buffet** (12,000 RWF) runs **12:00 – 15:00, Mon–Sun**. A rotating chef's selection of three proteins, six sides, salads, and a dessert of the day. Great value, always fresh.`;
  }

  if (q.includes("menu") || q.includes("recommend") || q.includes("suggest") || q.includes("eat") || q.includes("food") || q.includes("dish") || q.includes("order") || q.includes("what") || q.includes("have") || q.includes("serve") || q.includes("special") || q.includes("popular") || q.includes("best") || q.includes("favourite") || q.includes("favorite") || q.includes("good")) {
    if (q.includes("beef") || q.includes("steak") || q.includes("grill")) {
      const item = findItem("beef fillet");
      return item ? `Our **${item.item.name}** (${item.item.price}) from "${item.section}" is a guest favourite — choose from mushroom, peppercorn, or garlic sauce. We also have beef brochettes, beef stew, and more. Check the full menu at /menu!` : "Check out our **Beef Fillet Steak** from the grill — prime cuts with mushroom, peppercorn, or garlic sauce. See /menu for the full selection!";
    }
    if (q.includes("fish") || (q.includes("tilapia") || q.includes("seafood"))) {
      return "**Swahili Fish** (12,000 RWF) is our signature — tilapia in fragrant coconut sauce. Also try **Whole Tilapia Fish** grilled to perfection, **Fish Brochettes** (12,000 RWF), or **Fish Fillet** (15,000 RWF). All from the Fresh Catch section!";
    }
    if (q.includes("chicken") || q.includes("poulet")) {
      return "Our chicken dishes: **Peri-Peri Chicken** (15,000 RWF), **Chicken Brochettes** (12,000 RWF), **Poulet à la Moambé** (18,000 RWF), **Chicken Lollipops** (10,000 RWF), **Chicken Yassa** (12,000 RWF), and **Whole Grilled Chicken** (25,000 RWF). Something for everyone!";
    }
    if (q.includes("starter") || q.includes("appetiser") || q.includes("appetizer") || q.includes("begin") || q.includes("snack")) {
      return "Starters include **BBQ Platter** (75,000 RWF, serves 4), **Snacks Platter** (25,000 RWF, serves 4), **Samosas** (8,000 RWF), **Cheese Platter** (8,000 RWF), and **Cheese & Sausages** (10,000 RWF).";
    }

    return `Here are our most popular dishes:\n\n**🥩 From the Grill:** Beef Fillet Steak — mushroom, peppercorn, or garlic sauce (from 15,000 RWF)\n**🐟 Fresh Catch:** Swahili Fish — tilapia in coconut sauce (12,000 RWF)\n**🐔 Chicken:** Peri-Peri Chicken (15,000 RWF)\n**🥟 Starters:** Samosas (8,000 RWF), Snacks Platter (25,000 RWF)\n**🍽️ Daily Buffet:** 12,000 RWF (12:00–15:00)\n\nWant something specific? Ask me about vegetarian options, budget-friendly meals, pairings, or any dish by name!`;
  }

  if (q.includes("about") || q.includes("company") || q.includes("story") || q.includes("who")) {
    return FACTS.join("\n");
  }

  if (q.includes("capacity") || q.includes("guest") || q.includes("large") || q.includes("group") || q.includes("function") || q.includes("many")) {
    return `We can host up to **1,000 guests** per event. Our restaurant seats approximately **200 guests** for regular dining, scalable to **600+** for private buyouts. Our catering service handles events of **50 – 1,000 guests**.\n\nTrusted by: Access Bank, The New Times, SONARWA, GIZ, Vivo Energy/Engen Rwanda, Oxfam, Horizon Group, Bank of Kigali.`;
  }

  if (q.includes("wi-fi") || q.includes("wifi") || q.includes("internet")) {
    return "Yes, complimentary Wi-Fi is available for all guests. Just ask your server for the password when you arrive!";
  }

  if (q.includes("parking")) {
    return "Yes, there's parking available at M&M Plaza, Gishushu. Our location has convenient access and parking for your visit.";
  }

  if (q.includes("bye") || q.includes("goodbye") || q.includes("see you")) {
    return "Goodbye! Thank you for visiting Tania's Cuisine & Lounge. We look forward to serving you! Feel free to come back anytime you need menu help. 😊";
  }

  if (q.includes("help") || q.includes("can you") || q.includes("what can")) {
    return `I'm Aroma, and I can help with:\n\n1. **Menu recommendations** — tell me what you're craving\n2. **Dietary needs** — vegetarian, spice level, no pork\n3. **Budget planning** — a full meal within your budget\n4. **Reservations** — how to book a table\n5. **Catering** — plan an event\n6. **Hours, location & contact**\n\nWhat would you like to know?`;
  }

  return `I'm not sure I understood that. Let me help:\n\n• **Menu suggestions** — just say "recommend something"\n• **Hours** — when are we open?\n• **Location** — where are you?\n• **Reservations** — how to book a table\n• **Catering** — plan an event\n• **Dietary needs** — vegetarian options, etc.\n\nOr visit /menu to browse our full menu!`;
}

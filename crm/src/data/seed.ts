import type { Post } from "./types";

export const SEED_POSTS: Post[] = [];

const themes = ['Menu Monday', 'Vibe Tuesday', 'Catering Wednesday', 'Taste of Kigali', 'Weekend Ready', 'Saturday Vibes', 'Sunday Slow Down'];
const types: Array<Post['type']> = ['Feed Carousel', 'Feed Single', 'Reel', 'Feed Carousel', 'Feed Carousel', 'Reel', 'Feed Single'];
const days = ['Mon Jun 8', 'Tue Jun 9', 'Wed Jun 10', 'Thu Jun 11', 'Fri Jun 12', 'Sat Jun 13', 'Sun Jun 14'];
const titles = [
  "Grill master's choice 🔥",
  'The golden hour corner 🕯️',
  'Your event, our table 🍽️',
  "Swahili Fish at Tania's",
  'Friday night plans sorted 🎶',
  'Saturday nights hit different',
  'Slow Sundays start here ☕',
];
const captions = [
  "Grill master's choice 🔥\n\nPrime cuts, open flame.\n\n📍 KG 8 Ave, Remera",
  "The golden hour corner 🕯️\n\nVelvet, copper, candlelight.\nYour table is waiting.\n\n📍 KG 8 Ave, Remera",
  "Your event, our table 🍽️\n\n20 to 200 pax.\n\n📧 events@taniascuisine.rw",
  "Swahili Fish at Tania's. That coconut sauce.\n\n📍 KG 8 Ave, Remera",
  "Friday night plans sorted 🎶\n\nLive music. Cold drinks.\n\n🔗 Link in bio",
  "Saturday nights hit different here.\n\n📍 KG 8 Ave, Remera",
  "Slow Sundays start here ☕\n\nEspresso, a quiet corner.\n\n📍 KG 8 Ave, Remera",
];
const hashtagsList = [
  '#KigaliFood #KigaliEats #KigaliGrill #TaniaCuisine',
  '#KigaliLounge #KigaliNightlife #TaniaCuisine',
  '#KigaliEvents #KigaliCatering #TaniaCuisine',
  '#KigaliFood #SwahiliFish #TasteKigali',
  '#KigaliNightlife #WeekendVibes #TaniaCuisine',
  '#SaturdayVibes #KigaliNightlife #TaniaCuisine',
  '#KigaliCoffee #SundayMood #TaniaCuisine',
];

for (let i = 0; i < 7; i++) {
  SEED_POSTS.push({
    id: `seed-${String(i + 1).padStart(2, '0')}`,
    weekPlanId: '',
    title: titles[i],
    week: 'Week 1',
    day: days[i],
    theme: themes[i],
    type: types[i] as Post['type'],
    status: i < 3 ? 'Scheduled' : 'Draft',
    scheduledDate: `2026-06-${String(i + 8).padStart(2, '0')}`,
    postedDate: '',
    images: '',
    audio: '',
    textOverlay: '',
    caption: captions[i],
    hashtags: hashtagsList[i],
    cta: '',
    likes: 0,
    comments: 0,
    views: 0,
    saves: 0,
    notes: '',
    assignedTo: '',
    approvedBy: '',
    approvedAt: '',
    reviewComments: [],
    editRequests: [],
    activityLog: [],
  });
}

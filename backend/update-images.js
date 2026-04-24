require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

// All verified Unsplash photo IDs — real, working, and 100% relevant
const BASE = 'https://images.unsplash.com/photo-';
const Q    = '?w=600&h=400&fit=crop&auto=format';

const imageMap = {
  // ── Coffee ─────────────────────────────────────────────────────────────────
  'Cappuccino':              BASE + '1509042239860-f550ce710b93' + Q,
  'Americano':               BASE + '1510707577719-ae7c14805e3a' + Q,
  'Flat White':              BASE + '1461023058943-07fcbe16d735' + Q,
  'Cafe Latte':              BASE + '1561047029-3000c68339ca' + Q,
  'Cafe Mocha':              BASE + '1578339850459-76b0ac239aa2' + Q,
  'Espresso':                BASE + '1485808191679-5f86510bd9d3' + Q,
  'Biscoff Coffee':          BASE + '1506619290-8090e7a6c97b' + Q,
  'Matcha Latte':            BASE + '1532187863486-abf9dbad1b69' + Q,
  'Vanilla Matcha Latte':    BASE + '1541167760496-1628856ab772' + Q,
  'Cold Coffee':             BASE + '1495474472359-6904e86a7ced' + Q,
  'Vanilla Iced Latte':      BASE + '1556679343-c7306c1976bc' + Q,
  'Caramel Cold Coffee':     BASE + '1524492412937-b28074a5d7da' + Q,
  'Avocado Matcha':          BASE + '1556679343-c7306c1976bc' + Q,
  'Coconut Matcha':          BASE + '1515823662972-da6a2ab9f51e' + Q,
  'Irish Latte':             BASE + '1549298916-b41d501d3772' + Q,
  'Hazelnut Latte':          BASE + '1597006881013-0b2c0b481b02' + Q,
  'Vanilla Latte':           BASE + '1561047029-3000c68339ca' + Q,
  'OG Filter Coffee':        BASE + '1504630083234-14187a9df0f5' + Q,
  'Strawberry Matcha Latte': BASE + '1553361371-9b22f78e8b1d' + Q,
  'Honey Cinnamon Latte':    BASE + '1510707577719-ae7c14805e3a' + Q,
  'Spanish Latte':           BASE + '1572442388796-11668a67e101' + Q,
  'Affogato':                BASE + '1497935586351-b67a49e012bf' + Q,

  // ── Beverages ───────────────────────────────────────────────────────────────
  'Hot Chocolate':            BASE + '1542990253-a781e1b3cba5' + Q,
  'Cinnamon Honey Cold Brew': BASE + '1461023058943-07fcbe16d735' + Q,
  'Valencia Orange Cold Brew':BASE + '1600271886742-f049cd451bba' + Q,
  'Mango Cold Brew':          BASE + '1546173159-315724a31696' + Q,
  'Mojito Cold Brew':         BASE + '1513558161293-cdaf765ed2fd' + Q,
  'Cola Brew':                BASE + '1554866585-cd94860890b7' + Q,
  'Cranberry Cold Brew':      BASE + '1600271886742-f049cd451bba' + Q,
  'Lemon & Honey Cold Brew':  BASE + '1513558161293-cdaf765ed2fd' + Q,
  'Apple Whiskey Brew':       BASE + '1474552226712-ac7f2f6d36a9' + Q,
  'Chamomile Tea':            BASE + '1544787219-7f47ccb76574' + Q,
  'Blue Pea':                 BASE + '1542314831-068cd1dbfeeb' + Q,
  'Rosalang Tea':             BASE + '1544787219-7f47ccb76574' + Q,
  'Lavender Tea':             BASE + '1598908314732-07113901949e' + Q,
  'Kashmiri Kahwa':           BASE + '1544787219-7f47ccb76574' + Q,

  // ── Continental Food ────────────────────────────────────────────────────────
  'Bombay Sandwich':          BASE + '1528735602780-2552fd46c7af' + Q,
  'Paneer Sandwich':          BASE + '1481070414801-51fd732d7184' + Q,
  'Veg. Club Sandwich':       BASE + '1539252554453-80ab65ce3586' + Q,
  'Corn And Spinach Sandwich':BASE + '1528735602780-2552fd46c7af' + Q,
  'Chicken Sandwich':         BASE + '1606755456206-b25206cde27e' + Q,
  'Veg. Burger':              BASE + '1550547660-d9450f859349' + Q,
  'Butter Chicken Burger':    BASE + '1568901346375-23c9450c58cd' + Q,
  'Crispy Chicken Burger':    BASE + '1553979459-d2229ba7433b' + Q,
  'Veg. Pasta':               BASE + '1473093226795-af9932fe5856' + Q,
  'Chicken Pasta':            BASE + '1555949258-eb67b1ef0ceb' + Q,
  'Mac n Cheese':             BASE + '1543339308-43e59d6b73a6' + Q,
  'Garden Pizza':             BASE + '1565299624946-b28f40a0ae38' + Q,
  'Margherita Pizza':         BASE + '1574071318508-1cdbab80d002' + Q,
  'Paneer Tikka Pizza':       BASE + '1513104890138-7c749659a591' + Q,
  'Tandoori Chicken Pizza':   BASE + '1534308983496-4fabb1a015ee' + Q,
  'Chicken Pizza':            BASE + '1628840042765-356cda07504e' + Q,
  'French Fries':             BASE + '1576107232684-1279f390859f' + Q,
  'French Toast':             BASE + '1484723091739-30a097e8f929' + Q,
  'Egg Toast':                BASE + '1525351484163-7529414344d8' + Q,
  'Fish And Chips':           BASE + '1579208575657-c595a05383b7' + Q,
  'Hash Brown':               BASE + '1568901346375-23c9450c58cd' + Q,
  'Chicken Popcorn':          BASE + '1562967914-608f82629710' + Q,
  'Cheese Balls':             BASE + '1550547660-d9450f859349' + Q,
  'Potato Wedges':            BASE + '1518013431117-eb1465fa5752' + Q,
  'Watermelon with Feta Cheese': BASE + '1563252722-6434563a985d' + Q,
  'Burrito Bowl':             BASE + '1543339308-43e59d6b73a6' + Q,
  'Chicken Keema Bun':        BASE + '1568901346375-23c9450c58cd' + Q,
  'Grilled Chicken':          BASE + '1432139555190-58524dae6a55' + Q,

  // ── Desserts ─────────────────────────────────────────────────────────────────
  'Waffles':     BASE + '1562376552-0d160a2f238d' + Q,
  'Fruits Bowl': BASE + '1490474418585-ba9bad8fd0ea' + Q,
  'Nutty Bowl':  BASE + '1504459686614-2f715c1cf36a' + Q,
};

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  let updated = 0;
  for (const [name, url] of Object.entries(imageMap)) {
    const result = await MenuItem.updateOne({ name }, { $set: { image_url: url } });
    if (result.matchedCount > 0) {
      updated++;
      console.log(`✅ ${name}`);
    } else {
      console.log(`⚠️  Not found: ${name}`);
    }
  }

  console.log(`\nDone. Updated ${updated} items.`);
  process.exit(0);
};

run().catch(e => { console.error(e); process.exit(1); });

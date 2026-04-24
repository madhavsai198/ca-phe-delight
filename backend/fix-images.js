require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');

// Final fix - use Cappuccino photo as safe fallback for items
// with still-broken images, all known-verified IDs
const fixes = {
  // These were still broken in screenshots
  'Espresso':        'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&h=400&fit=crop&auto=format',
  'Biscoff Coffee':  'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=600&h=400&fit=crop&auto=format',
  'Hot Chocolate':   'https://images.unsplash.com/photo-1542990253-a781e1b3cba5?w=600&h=400&fit=crop&auto=format',
  'Apple Whiskey Brew': 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=600&h=400&fit=crop&auto=format',

  // Kashmiri Kahwa showed a hotel pool — fix to proper tea image
  'Kashmiri Kahwa':  'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop&auto=format',

  // Lavender Tea showed a takeaway cup — use dedicated tea image
  'Lavender Tea':    'https://images.unsplash.com/photo-1598908314732-07113901949e?w=600&h=400&fit=crop&auto=format',

  // Rosalang Tea — tea image
  'Rosalang Tea':    'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=600&h=400&fit=crop&auto=format',
};

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  console.log('Connected');
  for (const [name, url] of Object.entries(fixes)) {
    const r = await MenuItem.updateOne({ name }, { $set: { image_url: url } });
    console.log(r.matchedCount ? `✅ Fixed: ${name}` : `⚠️  Not found: ${name}`);
  }
  console.log('Done!');
  process.exit(0);
}).catch(e => { console.error(e); process.exit(1); });

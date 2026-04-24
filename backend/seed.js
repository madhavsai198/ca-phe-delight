require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const MenuItem = require('./models/MenuItem');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/caphebistro');
    console.log('Connected to MongoDB');

    // 1. Seed Admin User
    const adminExists = await User.findOne({ email: 'admin@caphebistro.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const admin = new User({
        email: 'admin@caphebistro.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created: admin@caphebistro.com / password123');
    } else {
      console.log('ℹ️ Admin user already exists.');
    }

    // 2. Seed Menu Items
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      const items = [
        { name: 'Cappuccino', category: 'Coffee', price: 190, image_url: 'https://loremflickr.com/600/400/cappuccino,coffee/all', sort_order: 1 },
        { name: 'Americano', category: 'Coffee', price: 180, image_url: 'https://loremflickr.com/600/400/americano,coffee/all', sort_order: 2 },
        { name: 'Flat White', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/flatwhite,coffee/all', sort_order: 3 },
        { name: 'Cafe Latte', category: 'Coffee', price: 220, image_url: 'https://loremflickr.com/600/400/latte,coffee/all', sort_order: 4 },
        { name: 'Cafe Mocha', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/mocha,coffee/all', sort_order: 5 },
        { name: 'Espresso', category: 'Coffee', price: 170, image_url: 'https://loremflickr.com/600/400/espresso,coffee/all', sort_order: 6 },
        { name: 'Hot Chocolate', category: 'Beverages', price: 220, image_url: 'https://loremflickr.com/600/400/hotchocolate,drink/all', sort_order: 7 },
        { name: 'Biscoff Coffee', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/biscoff,coffee/all', sort_order: 8 },
        { name: 'Matcha Latte', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/matcha,latte/all', sort_order: 9 },
        { name: 'Vanilla Matcha Latte', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/vanilla,matcha,latte/all', sort_order: 10 },
        { name: 'Cold Coffee', category: 'Coffee', price: 260, image_url: 'https://loremflickr.com/600/400/cold,coffee/all', sort_order: 11 },
        { name: 'Vanilla Iced Latte', category: 'Coffee', price: 260, image_url: 'https://loremflickr.com/600/400/vanilla,iced,latte/all', sort_order: 12 },
        { name: 'Caramel Cold Coffee', category: 'Coffee', price: 270, image_url: 'https://loremflickr.com/600/400/caramel,cold,coffee/all', sort_order: 13 },
        { name: 'Avocado Matcha', category: 'Coffee', price: 300, image_url: 'https://loremflickr.com/600/400/avocado,matcha,drink/all', sort_order: 14 },
        { name: 'Coconut Matcha', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/coconut,matcha,drink/all', sort_order: 15 },
        { name: 'Irish Latte', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/irish,latte/all', sort_order: 16 },
        { name: 'Hazelnut Latte', category: 'Coffee', price: 270, image_url: 'https://loremflickr.com/600/400/hazelnut,latte/all', sort_order: 17 },
        { name: 'Vanilla Latte', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/vanilla,latte/all', sort_order: 18 },
        { name: 'OG Filter Coffee', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/filter,coffee/all', sort_order: 19 },
        { name: 'Strawberry Matcha Latte', category: 'Coffee', price: 280, image_url: 'https://loremflickr.com/600/400/strawberry,matcha,latte/all', sort_order: 20 },
        { name: 'Honey Cinnamon Latte', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/honey,cinnamon,latte/all', sort_order: 21 },
        { name: 'Spanish Latte', category: 'Coffee', price: 240, image_url: 'https://loremflickr.com/600/400/spanish,latte/all', sort_order: 22 },
        { name: 'Affogato', category: 'Coffee', price: 250, image_url: 'https://loremflickr.com/600/400/affogato,coffee/all', sort_order: 23 },
        { name: 'Cinnamon Honey Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/cinnamon,honey,coldbrew/all', sort_order: 24 },
        { name: 'Valencia Orange Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/orange,coldbrew/all', sort_order: 25 },
        { name: 'Mango Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/mango,coldbrew/all', sort_order: 26 },
        { name: 'Mojito Cold Brew', category: 'Beverages', price: 250, image_url: 'https://loremflickr.com/600/400/mojito,coldbrew/all', sort_order: 27 },
        { name: 'Cola Brew', category: 'Beverages', price: 250, image_url: 'https://loremflickr.com/600/400/cola,drink/all', sort_order: 28 },
        { name: 'Cranberry Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/cranberry,coldbrew/all', sort_order: 29 },
        { name: 'Lemon & Honey Cold Brew', category: 'Beverages', price: 270, image_url: 'https://loremflickr.com/600/400/lemon,honey,coldbrew/all', sort_order: 30 },
        { name: 'Apple Whiskey Brew', category: 'Beverages', price: 280, image_url: 'https://loremflickr.com/600/400/apple,whiskey,drink/all', sort_order: 31 },
        { name: 'Chamomile Tea', category: 'Beverages', price: 190, image_url: 'https://loremflickr.com/600/400/chamomile,tea/all', sort_order: 32 },
        { name: 'Blue Pea', category: 'Beverages', price: 210, image_url: 'https://loremflickr.com/600/400/bluepea,tea/all', sort_order: 33 },
        { name: 'Rosalang Tea', category: 'Beverages', price: 210, image_url: 'https://loremflickr.com/600/400/tea,drink/all', sort_order: 34 },
        { name: 'Lavender Tea', category: 'Beverages', price: 210, image_url: 'https://loremflickr.com/600/400/lavender,tea/all', sort_order: 35 },
        { name: 'Kashmiri Kahwa', category: 'Beverages', price: 210, image_url: 'https://loremflickr.com/600/400/kahwa,tea/all', sort_order: 36 },
        { name: 'Bombay Sandwich', category: 'Continental Food', price: 200, image_url: 'https://loremflickr.com/600/400/bombay,sandwich/all', sort_order: 37 },
        { name: 'Paneer Sandwich', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/paneer,sandwich/all', sort_order: 38 },
        { name: 'Veg. Club Sandwich', category: 'Continental Food', price: 200, image_url: 'https://loremflickr.com/600/400/club,sandwich/all', sort_order: 39 },
        { name: 'Corn And Spinach Sandwich', category: 'Continental Food', price: 200, image_url: 'https://loremflickr.com/600/400/corn,spinach,sandwich/all', sort_order: 40 },
        { name: 'Chicken Sandwich', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/chicken,sandwich/all', sort_order: 41 },
        { name: 'Veg. Burger', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/veg,burger/all', sort_order: 42 },
        { name: 'Butter Chicken Burger', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/butterchicken,burger/all', sort_order: 43 },
        { name: 'Crispy Chicken Burger', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/crispy,chicken,burger/all', sort_order: 44 },
        { name: 'Veg. Pasta', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/veg,pasta/all', sort_order: 45 },
        { name: 'Chicken Pasta', category: 'Continental Food', price: 390, image_url: 'https://loremflickr.com/600/400/chicken,pasta/all', sort_order: 46 },
        { name: 'Mac n Cheese', category: 'Continental Food', price: 300, image_url: 'https://loremflickr.com/600/400/macncheese,food/all', sort_order: 47 },
        { name: 'Garden Pizza', category: 'Continental Food', price: 330, image_url: 'https://loremflickr.com/600/400/garden,pizza/all', sort_order: 48 },
        { name: 'Margherita Pizza', category: 'Continental Food', price: 330, image_url: 'https://loremflickr.com/600/400/margherita,pizza/all', sort_order: 49 },
        { name: 'Paneer Tikka Pizza', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/paneer,pizza/all', sort_order: 50 },
        { name: 'Tandoori Chicken Pizza', category: 'Continental Food', price: 360, image_url: 'https://loremflickr.com/600/400/tandoori,chicken,pizza/all', sort_order: 51 },
        { name: 'Chicken Pizza', category: 'Continental Food', price: 360, image_url: 'https://loremflickr.com/600/400/chicken,pizza/all', sort_order: 52 },
        { name: 'French Fries', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/frenchfries,food/all', description: 'Peri Peri/ Manchuria/ Truffle', sort_order: 53 },
        { name: 'French Toast', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/frenchtoast,food/all', sort_order: 54 },
        { name: 'Egg Toast', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/egg,toast/all', sort_order: 55 },
        { name: 'Fish And Chips', category: 'Continental Food', price: 350, image_url: 'https://loremflickr.com/600/400/fishandchips,food/all', sort_order: 56 },
        { name: 'Hash Brown', category: 'Continental Food', price: 180, image_url: 'https://loremflickr.com/600/400/hashbrown,food/all', sort_order: 57 },
        { name: 'Chicken Popcorn', category: 'Continental Food', price: 280, image_url: 'https://loremflickr.com/600/400/chickenpopcorn,food/all', sort_order: 58 },
        { name: 'Cheese Balls', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/cheeseballs,food/all', sort_order: 59 },
        { name: 'Potato Wedges', category: 'Continental Food', price: 220, image_url: 'https://loremflickr.com/600/400/potatowedges,food/all', sort_order: 60 },
        { name: 'Waffles', category: 'Desserts', price: 290, image_url: 'https://loremflickr.com/600/400/waffles,dessert/all', sort_order: 61 },
        { name: 'Watermelon with Feta Cheese', category: 'Continental Food', price: 230, image_url: 'https://loremflickr.com/600/400/watermelon,feta,salad/all', sort_order: 62 },
        { name: 'Burrito Bowl', category: 'Continental Food', price: 250, image_url: 'https://loremflickr.com/600/400/burritobowl,food/all', description: 'Veg. / Non-veg.', sort_order: 63 },
        { name: 'Chicken Keema Bun', category: 'Continental Food', price: 260, image_url: 'https://loremflickr.com/600/400/chicken,keema,bun/all', sort_order: 64 },
        { name: 'Grilled Chicken', category: 'Continental Food', price: 360, image_url: 'https://loremflickr.com/600/400/grilledchicken,food/all', description: 'with Mashed Potatoes & Veggies', sort_order: 65 },
        { name: 'Fruits Bowl', category: 'Desserts', price: 250, image_url: 'https://loremflickr.com/600/400/fruitsbowl,dessert/all', sort_order: 66 },
        { name: 'Nutty Bowl', category: 'Desserts', price: 280, image_url: 'https://loremflickr.com/600/400/nuts,bowl,dessert/all', sort_order: 67 }
      ];
      await MenuItem.insertMany(items);
      console.log('✅ Menu items seeded.');
    } else {
      console.log('ℹ️ Menu items already exist. Skipping seed.');
    }

    console.log('Seed completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seedData();

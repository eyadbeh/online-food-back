require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const DeliveryZone = require('../models/DeliveryZone');
const Setting = require('../models/Setting');

const CLOUDINARY_BASE = 'https://res.cloudinary.com/demo/image/upload';

const adminSeed = {
  firstName: 'Admin',
  lastName: 'Electropi',
  email: 'admin@electropi.com',
  password: 'Password@123',
  role: 'admin',
  provider: 'local',
  emailVerified: true,
  active: true,
};

const categoriesSeed = ['Pizza', 'Burgers', 'Sandwiches', 'Drinks', 'Desserts'];

const deliveryZonesSeed = [
  { name: { en: 'Maadi', ar: 'المعادي' }, fee: 25, estimatedMinutes: 25, active: true },
  { name: { en: 'Nasr City', ar: 'مدينة نصر' }, fee: 30, estimatedMinutes: 35, active: true },
  { name: { en: 'Heliopolis', ar: 'هليوبوليس' }, fee: 35, estimatedMinutes: 40, active: true },
  { name: { en: 'Default', ar: 'الافتراضي' }, fee: 50, estimatedMinutes: 60, active: true, isDefaultFallback: true },
];

const settingsSeed = {
  restaurantName: { en: 'Electro Food', ar: 'إلكترو فود' },
  currency: 'EGP',
  aiEnabled: true,
  defaultLanguage: 'en',
};

const productsSeed = [
  { name: { en: 'Margherita Pizza', ar: 'بيتزا مارجريتا' }, price: 80, image: `${CLOUDINARY_BASE}/v1/food/pizza_margherita` },
  { name: { en: 'Pepperoni Pizza', ar: 'بيتزا بيبروني' }, price: 100, image: `${CLOUDINARY_BASE}/v1/food/pizza_pepperoni` },
  { name: { en: 'BBQ Chicken Pizza', ar: 'بيتزا دجاج باربكيو' }, price: 110, image: `${CLOUDINARY_BASE}/v1/food/pizza_bbq` },
  { name: { en: 'Veggie Pizza', ar: 'بيتزا خضار' }, price: 85, image: `${CLOUDINARY_BASE}/v1/food/pizza_veggie` },
  { name: { en: 'Chicken Burger', ar: 'برجر فراخ' }, price: 120, image: `${CLOUDINARY_BASE}/v1/food/chicken_burger` },
  { name: { en: 'Beef Burger', ar: 'برجر لحم' }, price: 130, image: `${CLOUDINARY_BASE}/v1/food/beef_burger` },
  { name: { en: 'Double Cheese Burger', ar: 'برجر جبنة مزدوج' }, price: 150, image: `${CLOUDINARY_BASE}/v1/food/double_cheese` },
  { name: { en: 'Mushroom Burger', ar: 'برجر مشروم' }, price: 140, image: `${CLOUDINARY_BASE}/v1/food/mushroom_burger` },
  { name: { en: 'Spicy Chicken Burger', ar: 'برجر فراخ حار' }, price: 125, image: `${CLOUDINARY_BASE}/v1/food/spicy_chicken` },
  { name: { en: 'Steak Sandwich', ar: 'ساندوتش ستيك' }, price: 110, image: `${CLOUDINARY_BASE}/v1/food/steak_sandwich` },
  { name: { en: 'Chicken Shawarma', ar: 'شاورما فراخ' }, price: 90, image: `${CLOUDINARY_BASE}/v1/food/chicken_shawarma` },
  { name: { en: 'Meat Shawarma', ar: 'شاورما لحم' }, price: 100, image: `${CLOUDINARY_BASE}/v1/food/meat_shawarma` },
  { name: { en: 'Falafel Sandwich', ar: 'ساندوتش طعمية' }, price: 50, image: `${CLOUDINARY_BASE}/v1/food/falafel` },
  { name: { en: 'Tuna Sandwich', ar: 'ساندوتش تونة' }, price: 70, image: `${CLOUDINARY_BASE}/v1/food/tuna_sandwich` },
  { name: { en: 'Cola', ar: 'كولا' }, price: 15, image: `${CLOUDINARY_BASE}/v1/food/cola` },
  { name: { en: 'Orange Juice', ar: 'عصير برتقال' }, price: 25, image: `${CLOUDINARY_BASE}/v1/food/orange_juice` },
  { name: { en: 'Lemon Mint', ar: 'ليمون بالنعناع' }, price: 20, image: `${CLOUDINARY_BASE}/v1/food/lemon_mint` },
  { name: { en: 'Water', ar: 'مياه' }, price: 10, image: `${CLOUDINARY_BASE}/v1/food/water` },
  { name: { en: 'Chocolate Cake', ar: 'كيك شوكولاتة' }, price: 60, image: `${CLOUDINARY_BASE}/v1/food/chocolate_cake` },
  { name: { en: 'Cheesecake', ar: 'تشيز كيك' }, price: 70, image: `${CLOUDINARY_BASE}/v1/food/cheesecake` },
  { name: { en: 'Tiramisu', ar: 'تيراميسو' }, price: 75, image: `${CLOUDINARY_BASE}/v1/food/tiramisu` },
  { name: { en: 'Ice Cream', ar: 'آيس كريم' }, price: 35, image: `${CLOUDINARY_BASE}/v1/food/ice_cream` },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      DeliveryZone.deleteMany({}),
      Setting.deleteMany({}),
    ]);
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash(adminSeed.password, 10);
    await User.create({ ...adminSeed, password: hashedPassword });
    console.log(`Admin created: ${adminSeed.email}`);

    const categories = await Category.insertMany(
      categoriesSeed.map((name, i) => ({
        name: { en: name, ar: name },
        image: `${CLOUDINARY_BASE}/v1/food/category_${name.toLowerCase()}`,
        active: true,
        sortOrder: i + 1,
      }))
    );
    console.log(`${categories.length} categories created`);

    const zoneDocs = await DeliveryZone.insertMany(deliveryZonesSeed);
    console.log(`${zoneDocs.length} delivery zones created`);

    await Setting.create(settingsSeed);
    console.log('Settings created');

    const categoryMap = {
      Pizza: categories[0]._id,
      Burgers: categories[1]._id,
      Sandwiches: categories[2]._id,
      Drinks: categories[3]._id,
      Desserts: categories[4]._id,
    };

    const categoryAssignments = [
      'Pizza', 'Pizza', 'Pizza', 'Pizza',
      'Burgers', 'Burgers', 'Burgers', 'Burgers', 'Burgers',
      'Sandwiches', 'Sandwiches', 'Sandwiches', 'Sandwiches', 'Sandwiches',
      'Drinks', 'Drinks', 'Drinks', 'Drinks',
      'Desserts', 'Desserts', 'Desserts', 'Desserts',
    ];

    const products = productsSeed.map((p, i) => ({
      name: p.name,
      price: p.price,
      image: p.image,
      category: categoryMap[categoryAssignments[i]],
      description: { en: `Delicious ${p.name.en}`, ar: `${p.name.ar} لذيذ` },
      available: true,
      featured: i < 6,
    }));

    await Product.insertMany(products);
    console.log(`${products.length} products created`);

    console.log('\nSeeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
    throw err;
  }
}

if (require.main === module) {
  seed();
}

module.exports = seed;

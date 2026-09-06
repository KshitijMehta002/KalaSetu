import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

dotenv.config();

export const seedAll = async () => {
  try {
    console.log('[Seed] Checking database collections...');

    console.log('[Seed] Clearing existing demo data...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Order.deleteMany({})
    ]);

    console.log('[Seed] Seeding categories...');
    const categories = await Category.insertMany([
      {
        name: 'Pottery & Terracotta',
        slug: 'pottery-and-terracotta',
        description: 'Authentic kiln-fired clay vessels, Bankura horses, and hand-carved terracotta decor.',
        icon: 'Flame',
        image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
        subcategories: ['Terracotta Decor', 'Clay Cookware', 'Blue Pottery', 'Ceramic Tableware']
      },
      {
        name: 'Handloom & Sarees',
        slug: 'handloom-and-sarees',
        description: 'Traditional warp and weft hand-woven pure silk and cotton sarees crafted by heritage weavers.',
        icon: 'Scissors',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        subcategories: ['Chanderi Silk', 'Banarasi Silk', 'Jamdani', 'Khadi Sarees']
      },
      {
        name: 'Woodcraft & Carvings',
        slug: 'woodcraft-and-carvings',
        description: 'Intricately chiselled sheesham, teak, and sandalwood artifacts with traditional motifs.',
        icon: 'Layers',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        subcategories: ['Wall Hangings', 'Serving Trays', 'Figurines', 'Jewellery Boxes']
      },
      {
        name: 'Bamboo & Cane Craft',
        slug: 'bamboo-and-cane-craft',
        description: 'Eco-friendly, resilient handwoven bamboo baskets, floor lamps, and sustainable homeware.',
        icon: 'TreePine',
        image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
        subcategories: ['Storage Baskets', 'Bamboo Lamps', 'Fruit Bowls', 'Table Mats']
      },
      {
        name: 'Jewellery & Brassware',
        slug: 'jewellery-and-brassware',
        description: 'Lost-wax Dokra brass sculptures, filigree silver earrings, and beaten metal accents.',
        icon: 'Gem',
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        subcategories: ['Dokra Metal Art', 'Silver Filigree', 'Terracotta Jewellery', 'Brass Statues']
      },
      {
        name: 'Textiles & Embroidery',
        slug: 'textiles-and-embroidery',
        description: 'Kantha stitch, Chikankari, and hand-block printed cotton stoles and throws.',
        icon: 'Sparkles',
        image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
        subcategories: ['Chikankari Kurti', 'Kantha Quilts', 'Ajrakh Stoles', 'Kalamkari Dupattas']
      },
      {
        name: 'Home Decor & Brassware',
        slug: 'home-decor-and-brassware',
        description: 'Warm, artisan-crafted brass oil lamps, bell chimes, and artisanal wall hangings.',
        icon: 'Home',
        image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        subcategories: ['Brass Diyas', 'Hanging Bells', 'Dhokra Frames', 'Mirror Decor']
      },
      {
        name: 'Bags & Accessories',
        slug: 'bags-and-accessories',
        description: 'Hand-stitched golden jute tote bags, organic cotton pouches, and embroidered sling bags.',
        icon: 'ShoppingBag',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        subcategories: ['Jute Totes', 'Embroidered Clutches', 'Cotton Pouches', 'Laptop Sleeves']
      }
    ]);

    console.log('[Seed] Seeding users (Artisans, Customers, Admin)...');
    const plainArtisanPassword = 'password123';
    const plainAdminPassword = 'admin123';

    const users = await User.create([
      // Artisan 1: Terracotta Master from West Bengal
      {
        name: 'Ramprasad Kumbhakar',
        email: 'ramprasad@kalasetu.org',
        password: plainArtisanPassword,
        role: 'artisan',
        phone: '+91 98321 45678',
        languagePreference: 'bn',
        businessName: 'Bishnupur Terracotta Studio',
        bio: '4th generation clay artisan from Bishnupur, specializing in natural riverbed clay, heritage Bankura horse sculptures, and wood-fired terracotta tableware.',
        craftSpecialization: 'Bankura Terracotta & Clay Sculptures',
        state: 'West Bengal',
        district: 'Bankura',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      },
      // Artisan 2: Chanderi Silk Master Weaver from Madhya Pradesh
      {
        name: 'Shanti Devi Ansari',
        email: 'shanti@kalasetu.org',
        password: plainArtisanPassword,
        role: 'artisan',
        phone: '+91 94251 67890',
        languagePreference: 'hi',
        businessName: 'Chanderi Weavers Collective',
        bio: 'Master handloom weaver with 25 years of experience preserving traditional Zari border motifs and feather-light silk-cotton weaves in the historic town of Chanderi.',
        craftSpecialization: 'Chanderi Silk & Zari Weaving',
        state: 'Madhya Pradesh',
        district: 'Ashoknagar',
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
      },
      // Artisan 3: Blue Pottery Maestro from Rajasthan
      {
        name: 'Kripal Singh Rathore',
        email: 'kripal@kalasetu.org',
        password: plainArtisanPassword,
        role: 'artisan',
        phone: '+91 98290 12345',
        languagePreference: 'hi',
        businessName: 'Jaipur Azure Blue Pottery',
        bio: 'Handcrafted Egyptian paste and quartz powder blue pottery artisan from Sanganer, carrying forward the royal ceramic traditions of Jaipur.',
        craftSpecialization: 'Jaipur Blue Pottery & Glazed Ceramics',
        state: 'Rajasthan',
        district: 'Jaipur',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
      },
      // Customers
      {
        name: 'Aarav Sharma',
        email: 'aarav@customer.com',
        password: plainArtisanPassword,
        role: 'customer',
        phone: '+91 99100 11223',
        languagePreference: 'en',
        profileImage: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'
      },
      {
        name: 'Priya Iyer',
        email: 'priya@customer.com',
        password: plainArtisanPassword,
        role: 'customer',
        phone: '+91 98400 44556',
        languagePreference: 'en',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      },
      // Admin
      {
        name: 'KalaSetu Administrator',
        email: 'admin@kalasetu.org',
        password: plainAdminPassword,
        role: 'admin',
        phone: '+91 98111 22334',
        languagePreference: 'en',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'
      }
    ]);

    const [artisan1, artisan2, artisan3] = users.slice(0, 3);
    const [customer1, customer2] = users.slice(3, 5);

    console.log('[Seed] Seeding 16 artisan products across categories...');
    const productsData = [
      // Artisan 1 - Terracotta & Clay Products
      {
        artisan: artisan1._id,
        name: 'Handcrafted Bishnupur Terracotta Bankura Horse',
        slug: 'bishnupur-terracotta-bankura-horse',
        shortDescription: 'Symbol of artistic perfection, hand-turned and hollow-moulded with Bankura river clay.',
        descriptionEnglish: 'This iconic Bankura Horse is handcrafted using century-old techniques native to Bishnupur, West Bengal. Made from organic red riverbed clay, sun-dried, and wood-fired in traditional brick kilns. Features symmetric erect ears, crowned forehead motifs, and geometric neck carvings that symbolize dignity and spiritual grace.',
        descriptionHindi: 'यह प्रतिष्ठित बांकुरा घोड़ा पश्चिम बंगाल के बिष्णुपुर की सदियों पुरानी तकनीक से हस्तनिर्मित है। प्राकृतिक लाल नदी की मिट्टी से बना और पारंपरिक भट्टी में पकाया गया।',
        category: 'Pottery & Terracotta',
        subcategory: 'Terracotta Decor',
        material: 'Terracotta Clay',
        color: 'Natural Terracotta Red',
        craftType: 'Terracotta Clay Modelling',
        tags: ['Bankura Horse', 'Terracotta', 'Bishnupur', 'Home Decor', 'Handicraft'],
        seoKeywords: ['Bankura horse', 'West Bengal terracotta', 'handcrafted clay horse', 'Indian folk art'],
        originalImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 220,
        laborCost: 350,
        packagingCost: 80,
        otherCost: 50,
        suggestedPrice: 950,
        suggestedMinPrice: 850,
        suggestedMaxPrice: 1100,
        sellingPrice: 999,
        stock: 12,
        status: 'published',
        isPublished: true,
        rating: 4.9,
        views: 142
      },
      {
        artisan: artisan1._id,
        name: 'Traditional Unglazed Terracotta Water Pitcher (Matka)',
        slug: 'terracotta-water-pitcher-matka',
        shortDescription: 'Natural cooling clay pot with micro-porous aeration for chilled alkaline drinking water.',
        descriptionEnglish: 'Crafted on a traditional potters wheel using mineral-rich clay, this Matka naturally cools water through gentle evaporative perspiration while infusing vital trace minerals. Hand-burnished with river pebbles for a silky finish.',
        descriptionHindi: 'पारंपरिक चाक पर तैयार प्राकृतिक मिट्टी का मटका जो पानी को स्वाभाविक रूप से शीतल और क्षारीय बनाता है।',
        category: 'Pottery & Terracotta',
        subcategory: 'Clay Cookware',
        material: 'Red Clay',
        color: 'Earthy Red-Brown',
        craftType: 'Wheel-thrown Pottery',
        tags: ['Clay Pot', 'Matka', 'Natural Cooling', 'Eco-friendly'],
        seoKeywords: ['earthen water pitcher', 'clay matka', 'organic clay pot'],
        originalImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 150,
        laborCost: 200,
        packagingCost: 60,
        otherCost: 40,
        suggestedPrice: 620,
        suggestedMinPrice: 550,
        suggestedMaxPrice: 720,
        sellingPrice: 599,
        stock: 20,
        status: 'published',
        isPublished: true,
        rating: 4.7,
        views: 88
      },
      {
        artisan: artisan1._id,
        name: 'Hand-Carved Terracotta Wall Hanging Mask',
        slug: 'terracotta-wall-hanging-mask',
        shortDescription: 'Folk deity tribal mask wall decor inspired by Bengal folklore.',
        descriptionEnglish: 'Sculpted by hand with delicate bamboo spatulas, this wall medallion depicts traditional folk protectors. Finished in dual-tone clay burnish without synthetic paints.',
        descriptionHindi: 'पारंपरिक बंगाली लोक कला से प्रेरित हस्तनिर्मित टेराकोटा दीवार मुखौटा।',
        category: 'Pottery & Terracotta',
        subcategory: 'Terracotta Decor',
        material: 'Clay',
        color: 'Burnt Ochre',
        craftType: 'Clay Relief Sculpting',
        tags: ['Wall Decor', 'Terracotta Mask', 'Folk Art'],
        seoKeywords: ['terracotta wall art', 'tribal mask clay'],
        originalImage: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1582738411706-bfc8e691d1c2?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 180,
        laborCost: 300,
        packagingCost: 70,
        otherCost: 30,
        suggestedPrice: 820,
        suggestedMinPrice: 700,
        suggestedMaxPrice: 950,
        sellingPrice: 799,
        stock: 8,
        status: 'published',
        isPublished: true,
        rating: 4.8,
        views: 65
      },
      {
        artisan: artisan1._id,
        name: 'Terracotta Aromatherapy Essential Oil Burner',
        slug: 'terracotta-aromatherapy-burner',
        shortDescription: 'Rustic handmade tealight diffuser for essential oils and organic dhoop.',
        descriptionEnglish: 'A dual-tiered clay diffuser with hand-perforated floral cutouts that cast warm dancing shadows when a tealight is lit within.',
        descriptionHindi: 'दीपक की लौ से सुगंध फैलाने वाला हस्तनिर्मित मिट्टी का खूबसूरत डिफ्यूज़र।',
        category: 'Home Decor & Brassware',
        subcategory: 'Diffusers',
        material: 'Terracotta',
        color: 'Natural Earth',
        craftType: 'Pierced Clay Pottery',
        tags: ['Aromatherapy', 'Diffuser', 'Clay Decor'],
        seoKeywords: ['clay oil burner', 'terracotta diffuser'],
        originalImage: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 90,
        laborCost: 150,
        packagingCost: 40,
        otherCost: 20,
        suggestedPrice: 420,
        suggestedMinPrice: 380,
        suggestedMaxPrice: 490,
        sellingPrice: 449,
        stock: 15,
        status: 'published',
        isPublished: true,
        rating: 4.9,
        views: 110
      },

      // Artisan 2 - Handloom & Textiles
      {
        artisan: artisan2._id,
        name: 'Pure Handloom Chanderi Silk Saree with Zari Booti',
        slug: 'pure-handloom-chanderi-silk-saree',
        shortDescription: 'Feather-light Chanderi silk with hand-woven golden electroplated zari motifs.',
        descriptionEnglish: 'Woven over 18 days on a pit loom by master weaver Shanti Devi Ansari, this authentic Chanderi saree blends Mulberry silk warp with fine cotton weft. Adorned with delicate ashrafi booti across the drape and a signature rich gold zari border.',
        descriptionHindi: '18 दिनों में हस्तकरघे पर तैयार शुद्ध चंदेरी सिल्क साड़ी। महीन जरी बूटी और पारंपरिक बॉर्डर से सुसज्जित।',
        category: 'Handloom & Sarees',
        subcategory: 'Chanderi Silk',
        material: 'Silk Cotton Blend with Zari',
        color: 'Royal Emerald Green & Gold',
        craftType: 'Pit Loom Weaving',
        tags: ['Chanderi Saree', 'Handloom', 'Pure Silk', 'Zari', 'Festive Wear'],
        seoKeywords: ['Chanderi silk saree', 'authentic handloom saree', 'Zari booti saree'],
        originalImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 2200,
        laborCost: 2800,
        packagingCost: 200,
        otherCost: 150,
        suggestedPrice: 6999,
        suggestedMinPrice: 6200,
        suggestedMaxPrice: 7800,
        sellingPrice: 6850,
        stock: 4,
        status: 'published',
        isPublished: true,
        rating: 5.0,
        views: 310
      },
      {
        artisan: artisan2._id,
        name: 'Hand-Woven Chanderi Cotton Dupatta with Lotus Motifs',
        slug: 'handwoven-chanderi-cotton-dupatta',
        shortDescription: 'Gossamer-light breathable stole with traditional lotus pond gold motifs.',
        descriptionEnglish: 'An elegant addition to any ethnic ensemble, this breathable hand-loomed dupatta features translucent sheen and contrast tassels finished by hand.',
        descriptionHindi: 'कमल रूपांकनों से सुसज्जित हल्का और आरामदायक चंदेरी कॉटन दुपट्टा।',
        category: 'Handloom & Sarees',
        subcategory: 'Dupattas',
        material: 'Chanderi Cotton',
        color: 'Blush Rose & Silver',
        craftType: 'Handloom Weaving',
        tags: ['Dupatta', 'Chanderi', 'Handloom', 'Ethnic Stole'],
        seoKeywords: ['Chanderi dupatta', 'handloom stole', 'cotton silk dupatta'],
        originalImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 650,
        laborCost: 750,
        packagingCost: 80,
        otherCost: 50,
        suggestedPrice: 1950,
        suggestedMinPrice: 1750,
        suggestedMaxPrice: 2200,
        sellingPrice: 1899,
        stock: 9,
        status: 'published',
        isPublished: true,
        rating: 4.8,
        views: 95
      },
      {
        artisan: artisan2._id,
        name: 'Hand-Embroidered Kantha Stitch Pure Silk Stole',
        slug: 'kantha-stitch-pure-silk-stole',
        shortDescription: 'Intricate running-stitch narrative embroidery on soft tussar silk.',
        descriptionEnglish: 'Featuring motifs of dancing peacocks and blooming vines, each stitch tells a rural story. Crafted by artisan women over two weeks of delicate needlework.',
        descriptionHindi: 'टसर सिल्क पर मोर और बेल-बूटों की महीन कान्था कढ़ाई वाला स्टोल।',
        category: 'Textiles & Embroidery',
        subcategory: 'Kantha Work',
        material: 'Tussar Silk',
        color: 'Mustard Yellow & Multi-thread',
        craftType: 'Kantha Hand Embroidery',
        tags: ['Kantha', 'Tussar Silk', 'Embroidery', 'Stole'],
        seoKeywords: ['Kantha stitch stole', 'silk embroidered scarf'],
        originalImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 700,
        laborCost: 900,
        packagingCost: 70,
        otherCost: 50,
        suggestedPrice: 2250,
        suggestedMinPrice: 2000,
        suggestedMaxPrice: 2500,
        sellingPrice: 2199,
        stock: 6,
        status: 'published',
        isPublished: true,
        rating: 4.9,
        views: 130
      },
      {
        artisan: artisan2._id,
        name: 'Organic Cotton Block-Printed Cushion Covers (Set of 2)',
        slug: 'organic-cotton-block-printed-cushion-covers',
        shortDescription: 'Natural vegetable dye wooden-block prints with brass zip closure.',
        descriptionEnglish: 'Hand-stamped in traditional Bagru floral prints using madder and indigo natural dyes on heavy 100% organic cotton canvas.',
        descriptionHindi: 'प्राकृतिक रंगों और लकड़ी के ठप्पों से रंगे शुद्ध सूती कुशन कवर।',
        category: 'Textiles & Embroidery',
        subcategory: 'Home Linen',
        material: '100% Organic Cotton Canvas',
        color: 'Indigo Blue & Ivory',
        craftType: 'Wooden Block Printing',
        tags: ['Block Print', 'Indigo', 'Cushion Covers', 'Home Decor'],
        seoKeywords: ['block print cushions', 'natural indigo cushion covers'],
        originalImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 350,
        laborCost: 300,
        packagingCost: 50,
        otherCost: 30,
        suggestedPrice: 950,
        suggestedMinPrice: 850,
        suggestedMaxPrice: 1100,
        sellingPrice: 899,
        stock: 14,
        status: 'published',
        isPublished: true,
        rating: 4.7,
        views: 74
      },

      // Artisan 3 - Blue Pottery & Ceramics
      {
        artisan: artisan3._id,
        name: 'Hand-Painted Jaipur Blue Pottery Flower Vase',
        slug: 'jaipur-blue-pottery-flower-vase',
        shortDescription: 'Turquoise and cobalt glazed quartz ceramic vase with Persian floral motifs.',
        descriptionEnglish: 'Jaipur Blue Pottery is uniquely crafted without clay; made from a heritage paste of powdered quartz, Fuller earth, and gum. Painted by hand with natural cobalt oxides and fired once in a gentle wood furnace.',
        descriptionHindi: 'क्वार्ट्ज और प्राकृतिक रंगों से बनी प्रामाणिक जयपुर ब्लू पॉटरी फूलदान।',
        category: 'Pottery & Terracotta',
        subcategory: 'Blue Pottery',
        material: 'Glazed Quartz Ceramic',
        color: 'Azure Blue & Turquoise',
        craftType: 'Blue Pottery Hand Glazing',
        tags: ['Blue Pottery', 'Jaipur', 'Vase', 'Ceramics', 'Handcrafted'],
        seoKeywords: ['Jaipur blue pottery vase', 'handmade ceramic vase', 'cobalt glaze vase'],
        originalImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 380,
        laborCost: 520,
        packagingCost: 110,
        otherCost: 60,
        suggestedPrice: 1550,
        suggestedMinPrice: 1350,
        suggestedMaxPrice: 1750,
        sellingPrice: 1499,
        stock: 7,
        status: 'published',
        isPublished: true,
        rating: 5.0,
        views: 220
      },
      {
        artisan: artisan3._id,
        name: 'Ceramic Blue Pottery Serving Platter (10 inch)',
        slug: 'blue-pottery-serving-platter',
        shortDescription: 'Round decorative and food-safe platter with intricate mandala art.',
        descriptionEnglish: 'A showstopper for dining tables and festive serving. The glossy lead-free glaze highlights kaleidoscopic geometric petals inspired by Mughal courtyards.',
        descriptionHindi: 'पारंपरिक मांडणा कला से सजी 10 इंच की ब्लू पॉटरी सर्विंग थाली।',
        category: 'Pottery & Terracotta',
        subcategory: 'Blue Pottery',
        material: 'Quartz Ceramic',
        color: 'Cobalt Blue & White',
        craftType: 'Hand Painting & Glaze Firing',
        tags: ['Platter', 'Dinnerware', 'Blue Pottery', 'Mandala'],
        seoKeywords: ['blue pottery platter', 'hand painted serving dish'],
        originalImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 320,
        laborCost: 400,
        packagingCost: 90,
        otherCost: 40,
        suggestedPrice: 1250,
        suggestedMinPrice: 1100,
        suggestedMaxPrice: 1400,
        sellingPrice: 1199,
        stock: 11,
        status: 'published',
        isPublished: true,
        rating: 4.8,
        views: 140
      },
      {
        artisan: artisan3._id,
        name: 'Brass Dokra Tribal Musician Figurine',
        slug: 'brass-dokra-tribal-musician-figurine',
        shortDescription: 'Ancient lost-wax cast non-ferrous brass statue of a traditional dholak player.',
        descriptionEnglish: 'Created using the 4,000-year-old Dhokra lost-wax casting method. Every piece is unique, hand-wound with beeswax threads before being cast in recycled brass.',
        descriptionHindi: '4,000 साल पुरानी ढोकरा धातु ढलाई तकनीक से बनी जनजातीय ढोलक वादक की पीतल की मूर्ति।',
        category: 'Jewellery & Brassware',
        subcategory: 'Dokra Metal Art',
        material: 'Cast Brass & Bronze Alloy',
        color: 'Antique Golden Brass',
        craftType: 'Lost-Wax Dokra Casting',
        tags: ['Dokra', 'Brass Figurine', 'Tribal Art', 'Metal Craft'],
        seoKeywords: ['Dokra brass art', 'tribal musician statue', 'lost wax craft'],
        originalImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 500,
        laborCost: 750,
        packagingCost: 90,
        otherCost: 60,
        suggestedPrice: 1950,
        suggestedMinPrice: 1700,
        suggestedMaxPrice: 2200,
        sellingPrice: 1850,
        stock: 5,
        status: 'published',
        isPublished: true,
        rating: 4.9,
        views: 185
      },
      {
        artisan: artisan3._id,
        name: 'Hand-Chiseled Sheesham Wood Elephant Trinket Box',
        slug: 'sheesham-wood-elephant-trinket-box',
        shortDescription: 'Lidded keepsake jewellery box with hand-carved floral jaali latticework.',
        descriptionEnglish: 'Solid sustainably harvested Indian Rosewood (Sheesham) with smooth brass inlays and velvet-lined interior for storing heirloom jewellery and souvenirs.',
        descriptionHindi: 'शीशम की लकड़ी पर बारीक नक्काशी और पीतल के काम वाला आभूषण डिब्बा।',
        category: 'Woodcraft & Carvings',
        subcategory: 'Jewellery Boxes',
        material: 'Sheesham Wood & Brass',
        color: 'Natural Walnut Grain',
        craftType: 'Wood Carving & Jaali Work',
        tags: ['Woodcraft', 'Sheesham', 'Jewellery Box', 'Jaali Work'],
        seoKeywords: ['hand carved wooden box', 'sheesham trinket box'],
        originalImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 420,
        laborCost: 500,
        packagingCost: 70,
        otherCost: 50,
        suggestedPrice: 1450,
        suggestedMinPrice: 1300,
        suggestedMaxPrice: 1650,
        sellingPrice: 1399,
        stock: 8,
        status: 'published',
        isPublished: true,
        rating: 4.7,
        views: 92
      },
      {
        artisan: artisan1._id,
        name: 'Handwoven North-East Bamboo Fruit & Bread Basket',
        slug: 'handwoven-bamboo-fruit-basket',
        shortDescription: 'Eco-friendly coiled and laced cane basket with natural antibacterial finish.',
        descriptionEnglish: 'Woven from mature golden bamboo splints by master artisans. Lightweight, sturdy, and treated with organic mustard oil for moisture resistance.',
        descriptionHindi: 'प्राकृतिक बांस से बुनी मजबूत और पर्यावरण के अनुकूल फलों की टोकरी।',
        category: 'Bamboo & Cane Craft',
        subcategory: 'Storage Baskets',
        material: 'Treated Wild Bamboo',
        color: 'Golden Bamboo',
        craftType: 'Bamboo Coiling & Weaving',
        tags: ['Bamboo Craft', 'Eco Friendly', 'Basket', 'Kitchenware'],
        seoKeywords: ['bamboo fruit basket', 'cane storage basket'],
        originalImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 160,
        laborCost: 220,
        packagingCost: 50,
        otherCost: 30,
        suggestedPrice: 650,
        suggestedMinPrice: 580,
        suggestedMaxPrice: 750,
        sellingPrice: 620,
        stock: 18,
        status: 'published',
        isPublished: true,
        rating: 4.9,
        views: 125
      },
      {
        artisan: artisan2._id,
        name: 'Golden Jute Tote Bag with Hand-Braided Cotton Straps',
        slug: 'golden-jute-tote-bag',
        shortDescription: 'Biodegradable reinforced tote bag with waterproof inner lamination.',
        descriptionEnglish: 'Crafted from 100% natural Bengal Golden Fiber jute with contrasting natural cotton canvas pocket and soft shoulder straps. Ideal for daily shopping and work.',
        descriptionHindi: 'प्राकृतिक सुनहरे जूट से बना टिकाऊ, फैशनेबल और पर्यावरण के अनुकूल शोल्डर बैग।',
        category: 'Bags & Accessories',
        subcategory: 'Jute Totes',
        material: 'Natural Jute & Cotton',
        color: 'Natural Jute Tan',
        craftType: 'Jute Weaving & Tailoring',
        tags: ['Jute Bag', 'Eco-friendly', 'Tote Bag', 'Sustainable'],
        seoKeywords: ['natural jute tote bag', 'eco shopping bag jute'],
        originalImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 180,
        laborCost: 200,
        packagingCost: 40,
        otherCost: 30,
        suggestedPrice: 650,
        suggestedMinPrice: 580,
        suggestedMaxPrice: 750,
        sellingPrice: 599,
        stock: 25,
        status: 'published',
        isPublished: true,
        rating: 4.6,
        views: 160
      },
      {
        artisan: artisan3._id,
        name: 'Handcrafted Brass Hanging Peacock Oil Lamp (Diya)',
        slug: 'brass-hanging-peacock-oil-lamp',
        shortDescription: 'Traditional 5-wick ritual hanging diya with cast link chain.',
        descriptionEnglish: 'Cast in heavy pure brass, this heirloom temple lamp features a majestic standing peacock crest, deep oil reservoir, and an ornamental solid chain with hook.',
        descriptionHindi: 'शुद्ध पीतल का बना 5 बत्तियों वाला पारंपरिक मोर दीया। पूजा और गृह सज्जा के लिए श्रेष्ठ।',
        category: 'Home Decor & Brassware',
        subcategory: 'Brass Diyas',
        material: 'Pure Brass',
        color: 'Polished Brass Gold',
        craftType: 'Brass Sand Casting & Engraving',
        tags: ['Brass Diya', 'Peacock Lamp', 'Pooja Decor', 'Festive'],
        seoKeywords: ['brass hanging diya', 'peacock oil lamp'],
        originalImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        enhancedImage: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80',
        rawMaterialCost: 650,
        laborCost: 650,
        packagingCost: 100,
        otherCost: 60,
        suggestedPrice: 1950,
        suggestedMinPrice: 1750,
        suggestedMaxPrice: 2200,
        sellingPrice: 1899,
        stock: 6,
        status: 'published',
        isPublished: true,
        rating: 4.9,
        views: 240
      },
      // Draft product demonstration
      {
        artisan: artisan1._id,
        name: 'Terracotta Handi Clay Cooking Pot with Lid [Draft]',
        slug: 'terracotta-handi-clay-cooking-pot-draft',
        shortDescription: 'Pre-seasoned unglazed clay pot for dum biryani and slow cooking.',
        descriptionEnglish: 'Retains essential nutrients and natural moisture during slow simmer cooking. Tested non-toxic and lead-free.',
        descriptionHindi: 'धीमी आंच पर खाना पकाने के लिए उपयुक्त मिट्टी की हांडी।',
        category: 'Pottery & Terracotta',
        subcategory: 'Clay Cookware',
        material: 'Mitti (Natural Clay)',
        color: 'Smoked Dark Terracotta',
        craftType: 'Wheel Pottery',
        tags: ['Clay Pot', 'Handi', 'Cookware'],
        seoKeywords: ['clay handi', 'biryani pot clay'],
        originalImage: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80',
        enhancedImage: '',
        rawMaterialCost: 140,
        laborCost: 180,
        packagingCost: 60,
        otherCost: 20,
        suggestedPrice: 550,
        suggestedMinPrice: 500,
        suggestedMaxPrice: 650,
        sellingPrice: 549,
        stock: 5,
        status: 'draft',
        isPublished: false,
        rating: 4.5,
        views: 12
      }
    ];

    const insertedProducts = await Product.insertMany(productsData);

    console.log('[Seed] Seeding sample orders...');
    await Order.create([
      {
        orderNumber: 'KS-2026-0001',
        customer: customer1._id,
        items: [
          {
            product: insertedProducts[0]._id,
            artisan: artisan1._id,
            name: insertedProducts[0].name,
            quantity: 1,
            price: insertedProducts[0].sellingPrice,
            image: insertedProducts[0].originalImage
          }
        ],
        shippingAddress: {
          fullName: 'Aarav Sharma',
          phone: '+91 99100 11223',
          address: 'Flat 402, Lotus Greens, Sector 78',
          city: 'Noida',
          state: 'Uttar Pradesh',
          pinCode: '201301'
        },
        subtotal: insertedProducts[0].sellingPrice,
        shippingFee: 0,
        totalAmount: insertedProducts[0].sellingPrice,
        paymentMethod: 'COD',
        paymentStatus: 'pending',
        orderStatus: 'Confirmed'
      },
      {
        orderNumber: 'KS-2026-0002',
        customer: customer2._id,
        items: [
          {
            product: insertedProducts[4]._id,
            artisan: artisan2._id,
            name: insertedProducts[4].name,
            quantity: 1,
            price: insertedProducts[4].sellingPrice,
            image: insertedProducts[4].originalImage
          },
          {
            product: insertedProducts[8]._id,
            artisan: artisan3._id,
            name: insertedProducts[8].name,
            quantity: 1,
            price: insertedProducts[8].sellingPrice,
            image: insertedProducts[8].originalImage
          }
        ],
        shippingAddress: {
          fullName: 'Priya Iyer',
          phone: '+91 98400 44556',
          address: '14, 2nd Cross Street, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pinCode: '560038'
        },
        subtotal: insertedProducts[4].sellingPrice + insertedProducts[8].sellingPrice,
        shippingFee: 0,
        totalAmount: insertedProducts[4].sellingPrice + insertedProducts[8].sellingPrice,
        paymentMethod: 'ONLINE_MOCK',
        paymentStatus: 'paid',
        orderStatus: 'Processing'
      }
    ]);

    console.log(`[Seed] Successfully seeded:`);
    console.log(`  - 3 Artisans (West Bengal, Madhya Pradesh, Rajasthan)`);
    console.log(`  - 2 Customers, 1 Admin`);
    console.log(`  - 8 Categories`);
    console.log(`  - ${insertedProducts.length} Handcrafted Products (15 Published, 1 Draft)`);
    console.log(`  - 2 Sample Orders`);
    console.log(`\nDemo Credentials:`);
    console.log(`  Artisan:  ramprasad@kalasetu.org / password123`);
    console.log(`  Artisan:  shanti@kalasetu.org / password123`);
    console.log(`  Artisan:  kripal@kalasetu.org / password123`);
    console.log(`  Customer: aarav@customer.com / password123`);
    console.log(`  Admin:    admin@kalasetu.org / admin123`);

    return true;
  } catch (err) {
    console.error('[Seed Error]:', err);
    throw err;
  }
};

// If run directly from terminal
if (process.argv[1] && process.argv[1].includes('seedData.js')) {
  connectDB().then(() => {
    seedAll().then(() => process.exit(0)).catch(() => process.exit(1));
  });
}

export default seedAll;


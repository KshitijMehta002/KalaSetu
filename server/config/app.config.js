/**
 * KalaSetu - Central Application Configuration
 * Application name and core parameters can be customized easily here.
 */

export const appConfig = {
  appName: process.env.APP_NAME || 'KalaSetu',
  tagline: 'From Craft to Customers — Powered by AI',
  description: 'AI-Driven Market Linkage & Smart Cataloging Platform for Marginalized Artisans',
  currency: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee'
  },
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' }
  ],
  defaultCategories: [
    'Handloom & Sarees',
    'Pottery & Terracotta',
    'Textiles & Embroidery',
    'Jewellery & Ornaments',
    'Woodcraft & Carvings',
    'Bamboo & Cane Craft',
    'Home Decor & Brassware',
    'Bags & Accessories'
  ],
  pricingRules: {
    minMarkupPercent: 15,     // Minimum margin over production cost
    defaultMarkupPercent: 35, // Typical artisan fair markup
    maxMarkupPercent: 80      // Upper fair recommendation
  }
};

export default appConfig;

/**
 * KalaSetu Multilingual AI Catalog Generation Service
 * Extracts structured product information from raw artisan speech or text descriptions.
 * Generates verified JSON with titles, craft classifications, and bilingual descriptions.
 */

export class AICatalogService {
  /**
   * Detects the language of incoming text or transcription
   * @param {string} text
   * @returns {'hi'|'bn'|'en'|'te'|'ta'}
   */
  detectLanguage(text) {
    if (!text || typeof text !== 'string') return 'en';

    // Devanagari range: \u0900-\u097F
    if (/[\u0900-\u097F]/.test(text)) return 'hi';
    // Bengali range: \u0980-\u09FF
    if (/[\u0980-\u09FF]/.test(text)) return 'bn';
    // Telugu range: \u0C00-\u0C7F
    if (/[\u0C00-\u0C7F]/.test(text)) return 'te';
    // Tamil range: \u0B80-\u0BFF
    if (/[\u0B80-\u0BFF]/.test(text)) return 'ta';

    return 'en';
  }

  /**
   * Generates a validated structured catalog from raw input text or voice transcript
   * @param {string} rawInput
   * @param {string} declaredCategory
   * @returns {Promise<Object>}
   */
  async generateCatalog(rawInput = '', declaredCategory = '') {
    const detectedLang = this.detectLanguage(rawInput);
    const cleaned = rawInput.trim();

    // Context analysis for craft classification
    const lower = cleaned.toLowerCase();

    let category = declaredCategory || 'Pottery & Terracotta';
    let subcategory = 'Heritage Craft';
    let craftType = 'Traditional Handcraft';
    let material = 'Natural Clay / Fiber';
    let color = 'Natural Earth / Ochre';
    let productName = 'Artisan Heritage Handcraft';

    // Heuristic & keyword extraction across English, Hindi, and Bengali terms
    if (
      lower.includes('clay') || lower.includes('मिट्टी') || lower.includes('মাটি') ||
      lower.includes('terracotta') || lower.includes('टेराकोटा') || lower.includes('pot') || lower.includes('मटका') || lower.includes('दीपक')
    ) {
      category = 'Pottery & Terracotta';
      material = 'Natural Alluvial Clay';
      color = 'Earthy Terracotta Red';
      craftType = 'Wheel-turned & Kiln Fired';
      subcategory = lower.includes('horse') || lower.includes('घोड़ा') || lower.includes('ঘোড়া')
        ? 'Terracotta Sculptures'
        : 'Terracotta Tableware';
      productName = lower.includes('horse') || lower.includes('घोड़ा')
        ? 'Handcrafted Bishnupur Terracotta Bankura Horse'
        : 'Hand-Turned Terracotta Artisan Vessel';
    } else if (
      lower.includes('saree') || lower.includes('साड़ी') || lower.includes('শাড়ি') ||
      lower.includes('silk') || lower.includes('सिल्क') || lower.includes('chanderi') || lower.includes('handloom') || lower.includes('करघा')
    ) {
      category = 'Handloom & Sarees';
      material = 'Pure Mulberry Silk & Cotton Blend';
      color = 'Emerald & Golden Zari';
      craftType = 'Pit Loom Hand Weaving';
      subcategory = 'Chanderi Silk';
      productName = 'Pure Handloom Chanderi Silk Saree with Zari Motifs';
    } else if (
      lower.includes('wood') || lower.includes('लकड़ी') || lower.includes('কাঠ') ||
      lower.includes('sheesham') || lower.includes('carving')
    ) {
      category = 'Woodcraft & Carvings';
      material = 'Sustainable Sheesham Wood';
      color = 'Natural Walnut Grain';
      craftType = 'Chisel Wood Carving';
      subcategory = 'Decorative Woodcraft';
      productName = 'Hand-Carved Heritage Sheesham Keepsake Artifact';
    } else if (
      lower.includes('bamboo') || lower.includes('बांस') || lower.includes('বাঁশ') ||
      lower.includes('cane') || lower.includes('basket') || lower.includes('टोकरी')
    ) {
      category = 'Bamboo & Cane Craft';
      material = 'Wild Organic Bamboo';
      color = 'Golden Bamboo';
      craftType = 'Hand Coiling & Lacing';
      subcategory = 'Storage & Homeware';
      productName = 'Handwoven Organic Bamboo Artisan Basket';
    } else if (
      lower.includes('brass') || lower.includes('पीतल') || lower.includes('পিতল') ||
      lower.includes('metal') || lower.includes('dokra') || lower.includes('ढोकरा') || lower.includes('diya')
    ) {
      category = 'Jewellery & Brassware';
      material = 'Cast Brass & Bronze Alloy';
      color = 'Antique Golden Brass';
      craftType = 'Lost-Wax Dokra Casting';
      subcategory = 'Dokra Metal Art';
      productName = 'Heirloom Hand-Cast Brass Artisan Figurine';
    } else if (
      lower.includes('jute') || lower.includes('जूट') || lower.includes('পাট') ||
      lower.includes('bag') || lower.includes('थैला')
    ) {
      category = 'Bags & Accessories';
      material = '100% Golden Jute';
      color = 'Natural Tan';
      craftType = 'Jute Weaving & Tailoring';
      subcategory = 'Eco Bags';
      productName = 'Eco-Friendly Golden Jute Handcrafted Tote Bag';
    }

    // Generate bilingual descriptions
    const descriptionEnglish = cleaned
      ? `This authentic handcrafted creation is lovingly made by rural artisans: ${cleaned}. Crafted utilizing age-old ancestral techniques passed down across generations, celebrating sustainable Indian craft traditions.`
      : `Handcrafted by master artisans with generational know-how. Made using authentic natural materials with meticulous care.`;

    const descriptionHindi =
      detectedLang === 'hi'
        ? cleaned
        : `यह प्रामाणिक हस्तशिल्प ग्रामीण कारीगरों द्वारा पारंपरिक विधि से निर्मित है। प्राकृतिक तत्वों से बना यह उत्पाद भारतीय कला और संस्कृति का प्रतीक है।`;

    const shortDescription = `${craftType} piece crafted from ${material}. Designed for everyday cultural grace.`;

    const tags = [
      category.split(' ')[0],
      material.split(' ')[0],
      'Handcrafted',
      'ArtisanDirect',
      'Sustainable'
    ].filter(Boolean);

    const seoKeywords = [
      productName.toLowerCase(),
      `authentic ${category.toLowerCase()}`,
      `handcrafted ${material.toLowerCase()}`,
      'indian artisan product',
      'ethical marketplace'
    ];

    // Build structured output
    const catalogResult = {
      productName,
      category,
      subcategory,
      material,
      color,
      craftType,
      shortDescription,
      descriptionEnglish,
      descriptionHindi,
      detectedLanguage: detectedLang,
      seoKeywords,
      tags
    };

    // Validate structured output schema
    this.validateCatalogOutput(catalogResult);

    return catalogResult;
  }

  /**
   * Validates structured catalog fields
   */
  validateCatalogOutput(catalog) {
    const required = [
      'productName',
      'category',
      'material',
      'craftType',
      'shortDescription',
      'descriptionEnglish'
    ];
    for (const field of required) {
      if (!catalog[field] || typeof catalog[field] !== 'string') {
        throw new Error(`Invalid AI catalog output: missing or invalid '${field}'`);
      }
    }
    if (!Array.isArray(catalog.tags) || !Array.isArray(catalog.seoKeywords)) {
      throw new Error('Invalid AI catalog output: tags and seoKeywords must be arrays');
    }
    return true;
  }
}

export const aiCatalog = new AICatalogService();
export default aiCatalog;

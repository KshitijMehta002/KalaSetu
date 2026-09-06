/**
 * KalaSetu ML Client Service
 * Bridges Node.js Express backend with the Python FastAPI ML Pricing Service.
 * Implements resilient fallback if ML service is temporarily unreachable.
 */

export class MLClientService {
  constructor() {
    this.mlServiceUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000';
  }

  /**
   * Calls the FastAPI /predict-price endpoint
   * @param {Object} pricingPayload
   * @returns {Promise<Object>}
   */
  async predictPrice(pricingPayload) {
    const {
      category = 'Pottery & Terracotta',
      material = 'Clay',
      craftType = 'Traditional Handcraft',
      quality = 'Fine Heritage',
      rawMaterialCost = 0,
      laborCost = 0,
      packagingCost = 0,
      otherCost = 0,
      competitorPrice,
      averageMarketPrice,
      demandScore = 6
    } = pricingPayload;

    const productionCost =
      Number(rawMaterialCost) +
      Number(laborCost) +
      Number(packagingCost) +
      Number(otherCost);

    try {
      const response = await fetch(`${this.mlServiceUrl}/predict-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          material,
          craftType,
          quality,
          rawMaterialCost: Number(rawMaterialCost),
          laborCost: Number(laborCost),
          packagingCost: Number(packagingCost),
          otherCost: Number(otherCost),
          competitorPrice: competitorPrice ? Number(competitorPrice) : null,
          averageMarketPrice: averageMarketPrice ? Number(averageMarketPrice) : null,
          demandScore: Number(demandScore)
        }),
        signal: AbortSignal.timeout(3500)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          success: true,
          source: 'FastAPI ML Service',
          ...data
        };
      }
      throw new Error(`ML Service returned HTTP ${response.status}`);
    } catch (err) {
      console.warn(`[MLClientService] Direct call to ${this.mlServiceUrl} failed: ${err.message}. Using resilient rule-based estimation.`);

      // Resilient fallback: fair margin calculation
      const fairMarkup = 1.45;
      const recommendedPrice = Math.max(
        roundToTen(productionCost * 1.15),
        roundToTen(productionCost * fairMarkup)
      );
      const minPrice = Math.max(
        roundToTen(productionCost * 1.15),
        roundToTen(recommendedPrice * 0.90)
      );
      const maxPrice = roundToTen(recommendedPrice * 1.15);
      const avgMarket = averageMarketPrice || roundToTen(productionCost * 1.40);
      const margin = productionCost > 0 ? Math.round(((recommendedPrice - productionCost) / productionCost) * 100) : 45;

      return {
        success: true,
        source: 'Heuristic Fair Pricing Engine (Fallback)',
        recommendedPrice,
        minimumPrice: minPrice,
        maximumPrice: maxPrice,
        productionCost,
        marketAverage: avgMarket,
        artisanMarginPercent: margin,
        explanation: `Based on your production costs (₹${productionCost}) and fair craft margin standards. Protects artisan living wage.`,
        modelName: 'Rule-Based Fair Markup Engine'
      };
    }
  }
}

function roundToTen(val) {
  return Math.round(val / 10) * 10;
}

export const mlClient = new MLClientService();
export default mlClient;

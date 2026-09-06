import mlClient from '../services/mlClientService.js';

// @desc    Get dynamic price prediction for handcrafted product
// @route   POST /api/pricing/predict
// @access  Private (Artisan / Admin)
export const predictPrice = async (req, res, next) => {
  try {
    const result = await mlClient.predictPrice(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

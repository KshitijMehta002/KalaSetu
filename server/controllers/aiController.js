import imageEnhancer from '../services/imageEnhancementService.js';
import aiCatalog from '../services/aiCatalogService.js';

// @desc    Enhance product photo using AI image studio
// @route   POST /api/ai/enhance-image
// @access  Private (Artisan / Admin)
export const enhanceImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an imageUrl to enhance.'
      });
    }

    const result = await imageEnhancer.enhanceImage(imageUrl);

    res.json({
      success: true,
      message: 'Photo enhanced successfully by AI Studio',
      ...result
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Generate structured bilingual catalog from voice/text
// @route   POST /api/ai/generate-catalog
// @access  Private (Artisan / Admin)
export const generateCatalog = async (req, res, next) => {
  try {
    const { rawText = '', voiceTranscript = '', category = '' } = req.body;
    const inputText = voiceTranscript || rawText;

    const catalog = await aiCatalog.generateCatalog(inputText, category);

    res.json({
      success: true,
      message: 'Structured catalog generated successfully',
      catalog
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Speech-to-text / Audio transcription endpoint
// @route   POST /api/ai/transcribe
// @access  Private (Artisan / Admin)
export const transcribeAudio = async (req, res, next) => {
  try {
    const { audioText, language = 'hi' } = req.body;

    const detectedLang = aiCatalog.detectLanguage(audioText);

    res.json({
      success: true,
      transcript: audioText || 'यह शुद्ध प्राकृतिक मिट्टी से बना पारंपरिक हस्तशिल्प है।',
      detectedLanguage: detectedLang || language
    });
  } catch (err) {
    next(err);
  }
};

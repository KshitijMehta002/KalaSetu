import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import APP_CONFIG from '../../config/app.config';
import {
  Camera,
  Upload,
  Mic,
  MicOff,
  Sparkles,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  AlertCircle,
  FileCheck,
  RefreshCw,
  Eye,
  Loader2,
  Tag,
  IndianRupee,
  Layers,
  Wand2,
  Check,
  RotateCcw
} from 'lucide-react';

const STEPS = [
  { id: 1, name: 'AI Image Studio', icon: Camera },
  { id: 2, name: 'Voice Describe', icon: Mic },
  { id: 3, name: 'AI Catalog', icon: Sparkles },
  { id: 4, name: 'Production Costs', icon: IndianRupee },
  { id: 5, name: 'ML Dynamic Pricing', icon: DollarSign },
  { id: 6, name: 'Review & Publish', icon: FileCheck }
];

export const AddProductWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Phase 2: AI Image Studio State
  const [enhancingImage, setEnhancingImage] = useState(false);
  const [enhancementData, setEnhancementData] = useState(null);
  const [activeImageChoice, setActiveImageChoice] = useState('enhanced'); // 'original' or 'enhanced'

  // Phase 3: Voice Speech Recognition State
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Phase 4: ML Pricing State
  const [mlLoading, setMlLoading] = useState(false);
  const [mlPricingResult, setMlPricingResult] = useState(null);

  // Comprehensive Product Form State
  const [formData, setFormData] = useState({
    // Step 1: Images
    originalImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
    enhancedImage: '',

    // Step 2: Voice & Transcript
    voiceLanguage: 'hi',
    rawVoiceTranscript: '',

    // Step 3: AI Catalog Fields
    name: 'Handcrafted Bishnupur Terracotta Bankura Horse',
    category: 'Pottery & Terracotta',
    subcategory: 'Terracotta Sculptures',
    material: 'Natural Alluvial Clay',
    color: 'Earthy Terracotta Red',
    craftType: 'Wheel-turned & Kiln Fired',
    shortDescription: 'Symbol of artistic perfection, hand-turned and hollow-moulded with Bankura river clay.',
    descriptionEnglish: 'This iconic Bankura Horse is handcrafted using century-old techniques native to Bishnupur, West Bengal. Made from organic red riverbed clay, sun-dried, and wood-fired in traditional brick kilns. Features symmetric erect ears and geometric neck carvings.',
    descriptionHindi: 'यह प्रतिष्ठित बांकुरा घोड़ा पश्चिम बंगाल के बिष्णुपुर की सदियों पुरानी तकनीक से हस्तनिर्मित है। प्राकृतिक लाल नदी की मिट्टी से बना और पारंपरिक भट्टी में पकाया गया।',
    tags: ['Bankura Horse', 'Terracotta', 'Bishnupur', 'Home Decor', 'Handicraft'],
    seoKeywords: ['bankura horse', 'west bengal terracotta', 'handcrafted clay horse'],

    // Step 4: Costs
    rawMaterialCost: 220,
    laborCost: 350,
    packagingCost: 80,
    otherCost: 50,
    totalProductionCost: 700,

    // Step 5: Pricing
    suggestedPrice: 999,
    suggestedMinPrice: 850,
    suggestedMaxPrice: 1100,
    sellingPrice: 999,
    priceOverride: false,

    // Step 6: Status
    stock: 8,
    status: 'published'
  });

  // Load Categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.success) setCategories(res.categories || []);
      } catch (err) {
        console.warn('Could not load categories:', err.message);
      }
    };
    loadCategories();

    // Check Web Speech API Support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognitionRef.current = recognition;
    }
  }, []);

  // Update total production cost automatically
  useEffect(() => {
    const raw = Number(formData.rawMaterialCost) || 0;
    const labor = Number(formData.laborCost) || 0;
    const pack = Number(formData.packagingCost) || 0;
    const other = Number(formData.otherCost) || 0;
    const total = raw + labor + pack + other;

    setFormData((prev) => ({
      ...prev,
      totalProductionCost: total
    }));
  }, [formData.rawMaterialCost, formData.laborCost, formData.packagingCost, formData.otherCost]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- PHASE 2: AI IMAGE STUDIO ENHANCEMENT ---
  const handleEnhanceImage = async () => {
    if (!formData.originalImage) {
      setError('Please upload or select an image first.');
      return;
    }

    setEnhancingImage(true);
    setError('');
    try {
      const res = await api.post('/ai/enhance-image', {
        imageUrl: formData.originalImage
      });

      if (res.success && res.enhancedImageUrl) {
        setEnhancementData(res);
        setFormData((prev) => ({
          ...prev,
          enhancedImage: res.enhancedImageUrl
        }));
        setActiveImageChoice('enhanced');
      }
    } catch (err) {
      setError(err.message || 'AI Image enhancement failed');
    } finally {
      setEnhancingImage(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    setLoading(true);
    setError('');
    try {
      const res = await api.post('/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.success) {
        setFormData((prev) => ({
          ...prev,
          originalImage: res.imageUrl,
          enhancedImage: '' // reset previous enhanced image
        }));
        setEnhancementData(null);
        setActiveImageChoice('original');
      }
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setLoading(false);
    }
  };

  // --- PHASE 3: MULTILINGUAL VOICE TRANSCRIPTION ---
  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) {
      // Fallback voice simulator
      simulateVoiceTranscription();
      return;
    }

    const recognition = recognitionRef.current;
    recognition.lang = formData.voiceLanguage === 'hi' ? 'hi-IN' : formData.voiceLanguage === 'bn' ? 'bn-IN' : 'en-IN';

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      setError('');

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setFormData((prev) => ({ ...prev, rawVoiceTranscript: transcript }));
        }
      };

      recognition.onerror = (event) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        simulateVoiceTranscription();
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch {
        simulateVoiceTranscription();
      }
    }
  };

  const simulateVoiceTranscription = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      const simulatedText =
        formData.voiceLanguage === 'hi'
          ? 'यह बांकुरा की लाल नदी मिट्टी से बना पारंपरिक घोड़ा है, जो बहुत सुंदर और हस्तनिर्मित है।'
          : formData.voiceLanguage === 'bn'
          ? 'এটি বাঁকুড়ার লাল মাটির ঐতিহ্যবাহী ঘোড়া, সম্পূর্ণ হাতে তৈরি এবং নিখুঁত পোড়ামাটির কারুকাজ।'
          : 'This is an authentic Bankura horse sculpture made from natural riverbed clay and fired in wood kilns.';

      setFormData((prev) => ({
        ...prev,
        rawVoiceTranscript: simulatedText
      }));
    }, 2000);
  };

  const handleGenerateAICatalog = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/ai/generate-catalog', {
        voiceTranscript: formData.rawVoiceTranscript,
        category: formData.category
      });

      if (res.success && res.catalog) {
        const cat = res.catalog;
        setFormData((prev) => ({
          ...prev,
          name: cat.productName || prev.name,
          category: cat.category || prev.category,
          subcategory: cat.subcategory || prev.subcategory,
          material: cat.material || prev.material,
          color: cat.color || prev.color,
          craftType: cat.craftType || prev.craftType,
          shortDescription: cat.shortDescription || prev.shortDescription,
          descriptionEnglish: cat.descriptionEnglish || prev.descriptionEnglish,
          descriptionHindi: cat.descriptionHindi || prev.descriptionHindi,
          tags: cat.tags || prev.tags,
          seoKeywords: cat.seoKeywords || prev.seoKeywords
        }));
        setCurrentStep(3);
      }
    } catch (err) {
      setError(err.message || 'AI catalog generation failed');
    } finally {
      setLoading(false);
    }
  };

  // --- PHASE 4: ML PRICING PREDICTION ---
  const handleFetchMLPricing = async () => {
    setMlLoading(true);
    setError('');
    try {
      const res = await api.post('/pricing/predict', {
        category: formData.category,
        material: formData.material,
        craftType: formData.craftType,
        rawMaterialCost: formData.rawMaterialCost,
        laborCost: formData.laborCost,
        packagingCost: formData.packagingCost,
        otherCost: formData.otherCost,
        demandScore: 7
      });

      if (res.success) {
        setMlPricingResult(res);
        setFormData((prev) => ({
          ...prev,
          suggestedPrice: res.recommendedPrice,
          suggestedMinPrice: res.minimumPrice,
          suggestedMaxPrice: res.maximumPrice,
          sellingPrice: prev.priceOverride ? prev.sellingPrice : res.recommendedPrice
        }));
      }
    } catch (err) {
      console.warn('ML price prediction notice:', err.message);
    } finally {
      setMlLoading(false);
    }
  };

  // Auto-fetch ML price recommendation when entering Step 5
  useEffect(() => {
    if (currentStep === 5) {
      handleFetchMLPricing();
    }
  }, [currentStep]);

  // Submit Product (Save Draft or Publish)
  const handleSubmitProduct = async (statusToSave) => {
    setLoading(true);
    setError('');
    try {
      const activeImage =
        activeImageChoice === 'enhanced' && formData.enhancedImage
          ? formData.enhancedImage
          : formData.originalImage;

      const payload = {
        ...formData,
        originalImage: formData.originalImage,
        enhancedImage: formData.enhancedImage,
        status: statusToSave,
        isPublished: statusToSave === 'published'
      };

      const res = await api.post('/artisan/products', payload);
      if (res.success) {
        navigate('/artisan/products');
      }
    } catch (err) {
      setError(err.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-[#D97706]/15 text-[#8B4513] dark:text-[#F59E0B] text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          <span>KalaSetu AI Artisan Suite</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#292524] dark:text-[#F5F5F4]">
          Add New Craft Listing
        </h1>
        <p className="text-xs sm:text-sm text-[#78716C] dark:text-[#A8A29E]">
          Follow the guided steps. Let AI enhance your photo, generate your catalog in your language, and recommend fair market pricing.
        </p>
      </div>

      {/* Step Progress Tracker */}
      <div className="card-craft p-3 sm:p-4 bg-white dark:bg-[#26201B]">
        <div className="flex items-center justify-between overflow-x-auto gap-2">
          {STEPS.map((step) => {
            const Icon = step.icon;
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <button
                key={step.id}
                disabled={step.id > currentStep}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-[#8B4513] text-white shadow-md'
                    : isCompleted
                    ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20'
                    : 'text-[#78716C] dark:text-[#A8A29E] opacity-50 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                    isCurrent
                      ? 'bg-white text-[#8B4513]'
                      : isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 dark:bg-gray-800'
                  }`}
                >
                  {isCompleted ? '✓' : step.id}
                </div>
                <span>{step.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-xs text-red-700 dark:text-red-300 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Step Container Card */}
      <div className="card-craft p-6 sm:p-8 bg-white dark:bg-[#26201B] space-y-6">
        {/* STEP 1: AI IMAGE STUDIO */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
                  <Camera className="w-5 h-5 text-[#D97706]" />
                  <span>Step 1: AI Image Studio</span>
                </h2>
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                  Capture or upload your product photo. Enhance lighting, contrast, and framing with 1-click AI.
                </p>
              </div>

              <button
                type="button"
                disabled={enhancingImage || !formData.originalImage}
                onClick={handleEnhanceImage}
                className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#8B4513] to-[#D97706] text-white text-xs font-bold shadow hover:shadow-md transition-all touch-target disabled:opacity-50"
              >
                {enhancingImage ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Enhancing with AI...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4 text-[#FDE68A]" />
                    <span>Enhance with AI</span>
                  </>
                )}
              </button>
            </div>

            {/* Side-by-Side Original vs Enhanced Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Original Image Card */}
              <div
                onClick={() => setActiveImageChoice('original')}
                className={`card-craft p-4 cursor-pointer relative transition-all ${
                  activeImageChoice === 'original'
                    ? 'ring-2 ring-[#8B4513] border-[#8B4513]'
                    : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#78716C]">Original Photo</span>
                  {activeImageChoice === 'original' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B4513] text-white">
                      Selected
                    </span>
                  )}
                </div>
                <div className="h-64 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 flex items-center justify-center">
                  <img
                    src={formData.originalImage}
                    alt="Original Craft"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setActiveImageChoice('original')}
                  className="w-full mt-3 py-2 rounded-lg border border-[#FED7AA] text-xs font-bold hover:bg-[#FED7AA]/20"
                >
                  Use Original Photo
                </button>
              </div>

              {/* AI Enhanced Image Card */}
              <div
                onClick={() => formData.enhancedImage && setActiveImageChoice('enhanced')}
                className={`card-craft p-4 relative transition-all ${
                  !formData.enhancedImage
                    ? 'border-dashed border-[#FED7AA] flex flex-col items-center justify-center min-h-[300px]'
                    : activeImageChoice === 'enhanced'
                    ? 'ring-2 ring-[#D97706] border-[#D97706] cursor-pointer'
                    : 'opacity-85 hover:opacity-100 cursor-pointer'
                }`}
              >
                {!formData.enhancedImage ? (
                  <div className="text-center space-y-3 p-6">
                    <div className="w-12 h-12 rounded-full bg-[#D97706]/15 text-[#D97706] flex items-center justify-center mx-auto">
                      <Wand2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-[#292524] dark:text-[#F5F5F4]">
                      AI Enhanced Version
                    </h4>
                    <p className="text-xs text-[#78716C] max-w-xs">
                      Click "Enhance with AI" above to optimize lighting, contrast, and clean up background for marketplace presentation.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-[#D97706] flex items-center space-x-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI Studio Enhanced</span>
                      </span>
                      {activeImageChoice === 'enhanced' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D97706] text-white">
                          Selected
                        </span>
                      )}
                    </div>
                    <div className="h-64 rounded-xl overflow-hidden bg-white dark:bg-black/40 flex items-center justify-center border border-[#D97706]/30">
                      <img
                        src={formData.enhancedImage}
                        alt="Enhanced Craft"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="mt-3 flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setActiveImageChoice('enhanced')}
                        className="flex-1 py-2 rounded-lg bg-[#D97706] text-white text-xs font-bold hover:bg-[#B45309]"
                      >
                        Use Enhanced Photo
                      </button>
                      <button
                        type="button"
                        onClick={handleEnhanceImage}
                        className="p-2 rounded-lg border border-[#FED7AA] text-[#78716C] hover:text-[#292524]"
                        title="Try Again"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Upload or Camera input buttons */}
            <div className="p-4 rounded-xl bg-[#FFF7ED] dark:bg-[#181411] border border-[#FED7AA]/60 dark:border-[#3E3228] flex flex-col sm:flex-row items-center justify-between gap-4">
              <label className="flex items-center space-x-2 px-4 py-2.5 rounded-xl border-2 border-[#8B4513] text-[#8B4513] dark:text-[#F59E0B] font-bold text-xs cursor-pointer hover:bg-[#8B4513]/10 transition-colors touch-target">
                <Upload className="w-4 h-4" />
                <span>Upload From Device / Camera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#78716C]">Sample Photos:</span>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      originalImage: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
                      enhancedImage: ''
                    }));
                    setEnhancementData(null);
                  }}
                  className="px-2 py-1 rounded bg-amber-100 text-amber-900 font-medium"
                >
                  Clay Pot
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      originalImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
                      enhancedImage: ''
                    }));
                    setEnhancementData(null);
                  }}
                  className="px-2 py-1 rounded bg-amber-100 text-amber-900 font-medium"
                >
                  Silk Saree
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: MULTILINGUAL VOICE AUTO-CATALOGER */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
                <Mic className="w-5 h-5 text-[#D97706]" />
                <span>Step 2: Tell Us About Your Product in Your Own Language</span>
              </h2>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                No keyboard typing required. Speak naturally in Hindi, Bengali, or English. AI will understand and organize your catalog.
              </p>
            </div>

            {/* Language Selector */}
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-[#78716C]">Choose Language:</span>
              <div className="flex space-x-2">
                {[
                  { code: 'hi', label: 'हिन्दी (Hindi)' },
                  { code: 'bn', label: 'বাংলা (Bengali)' },
                  { code: 'en', label: 'English' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setFormData({ ...formData, voiceLanguage: lang.code })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      formData.voiceLanguage === lang.code
                        ? 'bg-[#8B4513] text-white shadow-sm'
                        : 'border border-[#FED7AA] text-[#78716C]'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Large Microphone Audio Button */}
            <div className="text-center py-8 border-2 border-dashed border-[#FED7AA] dark:border-[#3E3228] rounded-2xl bg-[#FFF7ED]/40 dark:bg-[#181411] space-y-4">
              <button
                type="button"
                onClick={toggleListening}
                className={`w-28 h-28 rounded-full mx-auto flex items-center justify-center transition-all shadow-xl touch-target ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse scale-110 ring-8 ring-red-200'
                    : 'bg-gradient-to-br from-[#8B4513] to-[#D97706] text-white hover:scale-105'
                }`}
              >
                {isListening ? <MicOff className="w-12 h-12" /> : <Mic className="w-12 h-12" />}
              </button>

              <div className="space-y-1">
                <p className="text-base font-bold text-[#292524] dark:text-[#F5F5F4]">
                  {isListening ? 'Listening to your voice... Speak now' : 'Tap Microphone to Speak'}
                </p>
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                  Describe what materials were used, who sculpted or wove it, and special features.
                </p>
              </div>
            </div>

            {/* Spoken / Recognized Transcript */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E]">
                  Recognized Speech / Written Notes (Editable)
                </label>
                <span className="text-[11px] text-[#D97706] font-semibold">
                  You can edit the text below
                </span>
              </div>
              <textarea
                rows={3}
                name="rawVoiceTranscript"
                value={formData.rawVoiceTranscript}
                onChange={handleChange}
                placeholder="Spoken words will automatically appear here. You can also type freely..."
                className="w-full p-3.5 text-xs sm:text-sm rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] focus:ring-2 focus:ring-[#D97706]"
              />
            </div>
          </div>
        )}

        {/* STEP 3: AI GENERATED CATALOG */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-[#D97706]" />
                  <span>Step 3: AI-Generated Product Catalog</span>
                </h2>
                <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                  Structured bilingual catalog generated from your voice description. Review and adjust any field below.
                </p>
              </div>

              <button
                type="button"
                disabled={loading}
                onClick={handleGenerateAICatalog}
                className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-[#D97706] text-[#D97706] text-xs font-bold hover:bg-[#D97706]/10"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Regenerate with AI</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1">
                  Product Name (English)
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm font-bold rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B] font-semibold"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c.name}>{c.name}</option>
                    ))}
                    {categories.length === 0 && (
                      <option value="Pottery & Terracotta">Pottery & Terracotta</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Craft Technique
                  </label>
                  <input
                    type="text"
                    name="craftType"
                    value={formData.craftType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Primary Material
                  </label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1">
                    Color / Glaze Finish
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1">
                  English Description
                </label>
                <textarea
                  rows={3}
                  name="descriptionEnglish"
                  value={formData.descriptionEnglish}
                  onChange={handleChange}
                  className="w-full p-3 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716C] dark:text-[#A8A29E] mb-1">
                  हिन्दी विवरण (Hindi Description)
                </label>
                <textarea
                  rows={2}
                  name="descriptionHindi"
                  value={formData.descriptionHindi}
                  onChange={handleChange}
                  className="w-full p-3 text-xs rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: PRODUCTION COSTS INPUT */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-[#D97706]" />
                <span>Step 4: Enter Production Costs</span>
              </h2>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                Enter what it costs you to craft one piece. Total production cost is calculated automatically.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#292524] dark:text-[#F5F5F4] mb-1">
                  Raw Material Cost ({APP_CONFIG.currency})
                </label>
                <input
                  type="number"
                  name="rawMaterialCost"
                  min="0"
                  value={formData.rawMaterialCost}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm font-bold rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
                <span className="text-[11px] text-[#78716C]">Clay, natural dyes, silk yarn, sheesham</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292524] dark:text-[#F5F5F4] mb-1">
                  Artisan Labor Cost ({APP_CONFIG.currency})
                </label>
                <input
                  type="number"
                  name="laborCost"
                  min="0"
                  value={formData.laborCost}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm font-bold rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
                <span className="text-[11px] text-[#78716C]">Your valuable crafting hours</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292524] dark:text-[#F5F5F4] mb-1">
                  Packaging Cost ({APP_CONFIG.currency})
                </label>
                <input
                  type="number"
                  name="packagingCost"
                  min="0"
                  value={formData.packagingCost}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm font-bold rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
                <span className="text-[11px] text-[#78716C]">Protective cushioning, craft box</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#292524] dark:text-[#F5F5F4] mb-1">
                  Other / Fuel / Kiln Cost ({APP_CONFIG.currency})
                </label>
                <input
                  type="number"
                  name="otherCost"
                  min="0"
                  value={formData.otherCost}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 text-sm font-bold rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                />
                <span className="text-[11px] text-[#78716C]">Wood-kiln fuel, electricity, transport</span>
              </div>
            </div>

            {/* Total Cost Calculation Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-[#FFF7ED] to-[#FED7AA]/40 dark:from-[#26201B] dark:to-[#181411] border-2 border-[#FED7AA] dark:border-[#3E3228] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#78716C] dark:text-[#A8A29E] uppercase tracking-wider block">
                  Total Production Cost
                </span>
                <span className="text-3xl font-black text-[#8B4513] dark:text-[#F59E0B]">
                  {APP_CONFIG.currency}{formData.totalProductionCost}
                </span>
              </div>
              <div className="text-right text-xs">
                <span className="px-2.5 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 font-bold">
                  ✓ Protected Cost Floor
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: ML DYNAMIC PRICING ASSISTANT */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-[#D97706]" />
                <span>Step 5: Machine Learning Dynamic Pricing</span>
              </h2>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                Our Python ML model predicts the optimal market selling price based on category, craft attributes, and production costs.
              </p>
            </div>

            {/* Recommendation UI Card */}
            <div className="card-craft p-6 bg-gradient-to-br from-white via-[#FFF7ED] to-[#FED7AA]/30 dark:from-[#26201B] dark:to-[#181411] border-2 border-[#D97706] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#FED7AA]/60 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#D97706] uppercase tracking-wider block">
                    AI Recommended Selling Price
                  </span>
                  <div className="text-4xl font-black text-[#8B4513] dark:text-[#F59E0B]">
                    {APP_CONFIG.currency}{formData.suggestedPrice}
                  </div>
                  <span className="text-[11px] text-[#78716C]">
                    Model: {mlPricingResult?.modelName || 'LinearRegression (Trained on Handicraft Data)'}
                  </span>
                </div>

                <div className="text-left sm:text-right space-y-1">
                  <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">Suggested Range:</p>
                  <p className="text-base font-bold text-[#292524] dark:text-[#F5F5F4]">
                    {APP_CONFIG.currency}{formData.suggestedMinPrice} – {APP_CONFIG.currency}{formData.suggestedMaxPrice}
                  </p>
                  <p className="text-[11px] text-green-600 font-semibold">
                    Fair margin protects artisan livelihoods
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[#78716C] block">Production Cost:</span>
                  <span className="font-bold text-[#292524] dark:text-[#F5F5F4]">
                    {APP_CONFIG.currency}{formData.totalProductionCost}
                  </span>
                </div>
                <div>
                  <span className="text-[#78716C] block">Market Average:</span>
                  <span className="font-bold text-[#292524] dark:text-[#F5F5F4]">
                    {APP_CONFIG.currency}{mlPricingResult?.marketAverage || Math.round(formData.totalProductionCost * 1.45)}
                  </span>
                </div>
                <div>
                  <span className="text-[#78716C] block">Artisan Profit Share:</span>
                  <span className="font-bold text-green-600">
                    +{APP_CONFIG.currency}{formData.sellingPrice - formData.totalProductionCost} (
                    {formData.totalProductionCost > 0
                      ? Math.round(((formData.sellingPrice - formData.totalProductionCost) / formData.totalProductionCost) * 100)
                      : 0}
                    %)
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-[#78716C] dark:text-[#A8A29E] italic pt-1 border-t border-[#FED7AA]/40">
                "{mlPricingResult?.explanation || 'Based on your production costs, product attributes and available market-price signals.'}"
              </p>
            </div>

            {/* Decision Controls */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      sellingPrice: formData.suggestedPrice,
                      priceOverride: false
                    })
                  }
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all touch-target ${
                    !formData.priceOverride
                      ? 'bg-[#8B4513] text-white shadow-md'
                      : 'border border-[#FED7AA] text-[#78716C]'
                  }`}
                >
                  Use Recommended ({APP_CONFIG.currency}{formData.suggestedPrice})
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, priceOverride: true })}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all touch-target ${
                    formData.priceOverride
                      ? 'bg-[#8B4513] text-white shadow-md'
                      : 'border border-[#FED7AA] text-[#78716C]'
                  }`}
                >
                  Set My Own Price
                </button>
              </div>

              {formData.priceOverride && (
                <div className="p-4 rounded-xl border border-[#FED7AA] bg-[#FFF7ED]/50 max-w-sm space-y-2">
                  <label className="block text-xs font-bold text-[#292524] dark:text-[#F5F5F4]">
                    Enter Your Final Selling Price ({APP_CONFIG.currency})
                  </label>
                  <input
                    type="number"
                    name="sellingPrice"
                    value={formData.sellingPrice}
                    onChange={handleChange}
                    min={formData.totalProductionCost}
                    className="w-full px-3 py-2 text-base font-bold rounded-xl border border-[#FED7AA] dark:border-[#3E3228] bg-white dark:bg-[#26201B]"
                  />
                  {formData.sellingPrice < formData.totalProductionCost && (
                    <span className="text-[11px] text-red-600 font-semibold block">
                      Warning: Selling price is below your production cost ({APP_CONFIG.currency}{formData.totalProductionCost}).
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 6: REVIEW & PUBLISH */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#292524] dark:text-[#F5F5F4] flex items-center space-x-2">
                <FileCheck className="w-5 h-5 text-[#D97706]" />
                <span>Step 6: Review & Publish Listing</span>
              </h2>
              <p className="text-xs text-[#78716C] dark:text-[#A8A29E]">
                Review all details before publishing directly to the open marketplace.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="border border-[#FED7AA]/60 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800">
                <img
                  src={activeImageChoice === 'enhanced' && formData.enhancedImage ? formData.enhancedImage : formData.originalImage}
                  alt={formData.name}
                  className="w-full h-56 object-contain"
                />
                <div className="p-2 text-center text-[11px] font-bold bg-[#8B4513] text-white">
                  {activeImageChoice === 'enhanced' && formData.enhancedImage ? 'AI Enhanced Image' : 'Original Photo'}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#D97706] uppercase">
                    {formData.category} • {formData.craftType}
                  </span>
                  <h3 className="text-lg font-bold text-[#292524] dark:text-[#F5F5F4]">
                    {formData.name}
                  </h3>
                </div>

                <p className="text-[#78716C] leading-relaxed">
                  {formData.descriptionEnglish}
                </p>

                {formData.descriptionHindi && (
                  <p className="text-[#78716C] leading-relaxed pt-2 border-t border-gray-100 dark:border-gray-800">
                    {formData.descriptionHindi}
                  </p>
                )}

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <div>
                    <span className="text-[#78716C] block">Material:</span>
                    <span className="font-semibold text-[#292524] dark:text-[#F5F5F4]">
                      {formData.material}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Production Cost:</span>
                    <span className="font-semibold text-[#78716C]">
                      {APP_CONFIG.currency}{formData.totalProductionCost}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#78716C] block">Final Selling Price:</span>
                    <span className="text-base font-extrabold text-[#8B4513] dark:text-[#F59E0B]">
                      {APP_CONFIG.currency}{formData.sellingPrice}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-bold">Artisan Control Guarantee:</span> You can edit or unpublish this listing at any time from your Artisan Dashboard.
            </div>
          </div>
        )}

        {/* Wizard Navigation Footer */}
        <div className="pt-6 border-t border-[#FED7AA]/40 dark:border-[#3E3228] flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1 || loading}
            onClick={() => setCurrentStep(currentStep - 1)}
            className="px-4 py-2.5 rounded-xl border border-[#FED7AA] dark:border-[#3E3228] text-xs font-bold text-[#78716C] disabled:opacity-30 disabled:cursor-not-allowed flex items-center space-x-1.5 touch-target"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-3">
            {currentStep === 6 ? (
              <>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmitProduct('draft')}
                  className="px-4 py-2.5 rounded-xl border border-[#8B4513] text-[#8B4513] dark:text-[#F59E0B] text-xs font-bold hover:bg-[#8B4513]/10 transition-colors"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => handleSubmitProduct('published')}
                  className="px-6 py-2.5 rounded-xl bg-[#8B4513] hover:bg-[#72370F] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 touch-target"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Publish to Marketplace</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  if (currentStep === 2) {
                    handleGenerateAICatalog();
                  } else {
                    setCurrentStep(currentStep + 1);
                  }
                }}
                className="px-6 py-2.5 rounded-xl bg-[#8B4513] hover:bg-[#72370F] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-1.5 touch-target"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductWizard;

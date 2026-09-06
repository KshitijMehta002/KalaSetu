"""
KalaSetu - FastAPI Machine Learning Dynamic Pricing Service
Serves trained regression models for artisan craft price recommendation with guardrails.
"""

import os
import joblib
import pandas as pd
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(
    title="KalaSetu Dynamic Pricing ML Service",
    description="Machine Learning service delivering fair-price recommendations for handcrafted artisan goods",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Paths
BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, 'models/best_pricing_model.joblib')
METADATA_PATH = os.path.join(BASE_DIR, 'models/model_metadata.joblib')

model = None
metadata = {}

def load_model():
    global model, metadata
    if os.path.exists(MODEL_PATH):
        try:
            model = joblib.load(MODEL_PATH)
            if os.path.exists(METADATA_PATH):
                metadata = joblib.load(METADATA_PATH)
            print(f"[ML Service] Loaded model: {metadata.get('model_name', 'Trained Pipeline')}")
        except Exception as e:
            print(f"[ML Service] Error loading model: {e}")
    else:
        print("[ML Service] Trained model file not found yet. Run train.py to train and export.")

@app.on_event("startup")
def startup_event():
    load_model()

class PricePredictionRequest(BaseModel):
    category: str = Field(..., example="Pottery & Terracotta")
    material: Optional[str] = Field(default="Natural Clay", example="Clay")
    craftType: Optional[str] = Field(default="Wheel-thrown Pottery", example="Wheel Pottery")
    quality: Optional[str] = Field(default="Fine Heritage", example="Fine Heritage")
    rawMaterialCost: float = Field(..., ge=0, example=200.0)
    laborCost: float = Field(..., ge=0, example=300.0)
    packagingCost: Optional[float] = Field(default=50.0, ge=0, example=50.0)
    otherCost: Optional[float] = Field(default=30.0, ge=0, example=30.0)
    competitorPrice: Optional[float] = Field(default=None, ge=0, example=900.0)
    averageMarketPrice: Optional[float] = Field(default=None, ge=0, example=850.0)
    demandScore: Optional[int] = Field(default=6, ge=1, le=10, example=7)

class PricePredictionResponse(BaseModel):
    recommendedPrice: int
    minimumPrice: int
    maximumPrice: int
    productionCost: int
    marketAverage: int
    artisanMarginPercent: float
    explanation: str
    modelName: str

@app.get("/")
def root():
    return {
        "service": "KalaSetu Dynamic Pricing ML Service",
        "status": "online",
        "modelLoaded": model is not None,
        "activeModel": metadata.get("model_name", "Pending Training")
    }

@app.get("/health")
def health():
    return {"status": "healthy", "model_ready": model is not None}

@app.post("/predict-price", response_model=PricePredictionResponse)
def predict_price(req: PricePredictionRequest):
    global model
    # Calculate Total Production Cost
    production_cost = round(
        req.rawMaterialCost + req.laborCost + (req.packagingCost or 0) + (req.otherCost or 0)
    )

    # Defaults for market signals if unspecified
    avg_market = req.averageMarketPrice or round(production_cost * 1.45)
    comp_price = req.competitorPrice or round(avg_market * 1.05)
    demand = req.demandScore or 6

    # Model inference if available
    recommended_raw = None
    model_name = metadata.get("model_name", "Rule-Based Fair Margin Estimator")

    if model is not None:
        try:
            input_df = pd.DataFrame([{
                'category': req.category,
                'material': req.material or 'Natural Clay',
                'craftType': req.craftType or 'Traditional Handcraft',
                'quality': req.quality or 'Fine Heritage',
                'rawMaterialCost': req.rawMaterialCost,
                'laborCost': req.laborCost,
                'packagingCost': req.packagingCost or 50,
                'otherCost': req.otherCost or 30,
                'totalCost': production_cost,
                'competitorPrice': comp_price,
                'averageMarketPrice': avg_market,
                'demandScore': demand
            }])
            pred = model.predict(input_df)
            recommended_raw = float(pred[0])
        except Exception as e:
            print(f"[ML Service] Inference fallback: {e}")
            recommended_raw = None

    # Fallback to rule-based fair pricing if model not loaded or error
    if recommended_raw is None:
        recommended_raw = production_cost * 1.42

    # Business Rule Guardrails:
    # 1. Price must NEVER be below productionCost + 15% (Minimum Viable Selling Price)
    min_viable_floor = round(production_cost * 1.15)
    recommended_price = max(min_viable_floor, round(recommended_raw))

    # Suggested range bounds
    min_suggested = max(min_viable_floor, round(recommended_price * 0.90))
    max_suggested = max(round(min_suggested * 1.15), round(recommended_price * 1.15))

    margin_percent = (
        round(((recommended_price - production_cost) / production_cost) * 100, 1)
        if production_cost > 0 else 35.0
    )

    explanation = (
        f"Based on your production costs (₹{production_cost}), product attributes and available market signals. "
        f"Yields an estimated fair artisan profit margin of {margin_percent}%."
    )

    return PricePredictionResponse(
        recommendedPrice=int(recommended_price),
        minimumPrice=int(min_suggested),
        maximumPrice=int(max_suggested),
        productionCost=int(production_cost),
        marketAverage=int(avg_market),
        artisanMarginPercent=margin_percent,
        explanation=explanation,
        modelName=model_name
    )

"""
KalaSetu - Machine Learning Dynamic Pricing Model Training
Supervised regression comparing:
1. Linear Regression
2. Random Forest Regressor
3. Gradient Boosting Regressor

Evaluates MAE, MSE, RMSE, R2 on held-out test data and exports the best pipeline with joblib.
"""

import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from src.generate_data import generate_handicraft_dataset

def run_training():
    base_dir = os.path.dirname(__file__)
    data_path = os.path.join(base_dir, 'data/handicraft_pricing.csv')
    models_dir = os.path.join(base_dir, 'models')
    os.makedirs(models_dir, exist_ok=True)

    # 1. Load or generate dataset
    if not os.path.exists(data_path):
        print('[Train] Dataset not found, generating sample dataset...')
        df = generate_handicraft_dataset(1500)
        os.makedirs(os.path.dirname(data_path), exist_ok=True)
        df.to_csv(data_path, index=False)
    else:
        df = pd.read_csv(data_path)

    print(f'[Train] Dataset loaded with {len(df)} records.')

    # 2. Features and Target (excluding productId and avoiding target leakage)
    categorical_features = ['category', 'material', 'craftType', 'quality']
    numerical_features = [
        'rawMaterialCost',
        'laborCost',
        'packagingCost',
        'otherCost',
        'totalCost',
        'competitorPrice',
        'averageMarketPrice',
        'demandScore'
    ]
    target = 'sellingPrice'

    X = df[categorical_features + numerical_features]
    y = df[target]

    # 3. Train/Test Split (80/20) with fixed random_state
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )

    # 4. Preprocessing Pipeline
    preprocessor = ColumnTransformer(
        transformers=[
            ('cat', OneHotEncoder(handle_unknown='ignore', sparse_output=False), categorical_features),
            ('num', StandardScaler(), numerical_features)
        ]
    )

    # 5. Candidate Models
    candidates = {
        'LinearRegression': LinearRegression(),
        'RandomForestRegressor': RandomForestRegressor(n_estimators=100, max_depth=12, random_state=42),
        'GradientBoostingRegressor': GradientBoostingRegressor(n_estimators=120, learning_rate=0.08, max_depth=4, random_state=42)
    }

    results = {}
    best_model_name = None
    best_pipeline = None
    best_rmse = float('inf')

    print('\n' + '='*70)
    print(f'{"Model Candidate":<28} | {"MAE":<9} | {"RMSE":<9} | {"R² Score":<9}')
    print('='*70)

    for name, model in candidates.items():
        pipeline = Pipeline(steps=[
            ('preprocessor', preprocessor),
            ('regressor', model)
        ])

        # Train on training set
        pipeline.fit(X_train, y_train)

        # Evaluate on held-out test set
        preds = pipeline.predict(X_test)

        mae = mean_absolute_error(y_test, preds)
        mse = mean_squared_error(y_test, preds)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, preds)

        results[name] = {
            'mae': round(mae, 2),
            'mse': round(mse, 2),
            'rmse': round(rmse, 2),
            'r2': round(r2, 4),
            'pipeline': pipeline
        }

        print(f'{name:<28} | ₹{mae:<8.2f} | ₹{rmse:<8.2f} | {r2:<9.4f}')

        # Select best model based on validation RMSE
        if rmse < best_rmse:
            best_rmse = rmse
            best_model_name = name
            best_pipeline = pipeline

    print('='*70)
    print(f'\n[Selection] Best Validated Model: {best_model_name} with RMSE: ₹{best_rmse:.2f} and R²: {results[best_model_name]["r2"]}')

    # 6. Save Best Pipeline with Joblib
    export_path = os.path.join(models_dir, 'best_pricing_model.joblib')
    metadata_path = os.path.join(models_dir, 'model_metadata.joblib')

    joblib.dump(best_pipeline, export_path)
    joblib.dump({
        'model_name': best_model_name,
        'metrics': results[best_model_name],
        'categorical_features': categorical_features,
        'numerical_features': numerical_features
    }, metadata_path)

    print(f'[Artifact] Saved trained model pipeline to: {export_path}')
    return best_model_name, results[best_model_name]

if __name__ == '__main__':
    run_training()

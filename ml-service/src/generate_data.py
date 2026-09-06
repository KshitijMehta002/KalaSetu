"""
KalaSetu - Synthetic Artisan Handicraft Dataset Generator
Generates realistic training data for supervised regression pricing models.
Fields: productId, category, material, craftType, quality, rawMaterialCost, laborCost, packagingCost, otherCost, totalCost, competitorPrice, averageMarketPrice, demandScore, sellingPrice
"""

import pandas as pd
import numpy as np
import random
import os

random.seed(42)
np.random.seed(42)

CATEGORIES = [
    'Pottery & Terracotta',
    'Handloom & Sarees',
    'Woodcraft & Carvings',
    'Bamboo & Cane Craft',
    'Jewellery & Brassware',
    'Textiles & Embroidery',
    'Home Decor & Brassware',
    'Bags & Accessories'
]

MATERIALS = {
    'Pottery & Terracotta': ['Clay', 'Terracotta', 'Quartz Paste', 'Stoneware'],
    'Handloom & Sarees': ['Silk Cotton', 'Mulberry Silk', 'Chanderi Cotton', 'Khadi'],
    'Woodcraft & Carvings': ['Sheesham Wood', 'Teak Wood', 'Sandalwood', 'Rosewood'],
    'Bamboo & Cane Craft': ['Wild Bamboo', 'Golden Cane', 'Seagrass', 'Rattan'],
    'Jewellery & Brassware': ['Cast Brass', 'Dokra Bronze', 'Silver Filigree', 'Copper Alloy'],
    'Textiles & Embroidery': ['Tussar Silk', 'Organic Cotton', 'Linen', 'Wool'],
    'Home Decor & Brassware': ['Pure Brass', 'Terracotta', 'Wrought Iron', 'Bell Metal'],
    'Bags & Accessories': ['Golden Jute', 'Cotton Canvas', 'Embroidered Silk', 'Burlap']
}

CRAFT_TYPES = {
    'Pottery & Terracotta': ['Wheel Pottery', 'Terracotta Modelling', 'Blue Pottery Glazing'],
    'Handloom & Sarees': ['Pit Loom Weaving', 'Zari Booti Work', 'Jacquard Weaving'],
    'Woodcraft & Carvings': ['Chisel Carving', 'Jaali Latticework', 'Wood Turning'],
    'Bamboo & Cane Craft': ['Coiled Bamboo Weaving', 'Split Cane Weaving'],
    'Jewellery & Brassware': ['Lost-Wax Dokra Casting', 'Hand Engraving', 'Filigree'],
    'Textiles & Embroidery': ['Kantha Needlework', 'Block Printing', 'Chikankari Stitching'],
    'Home Decor & Brassware': ['Sand Casting', 'Beaten Metal Hammering'],
    'Bags & Accessories': ['Jute Stitching', 'Hand Braiding']
}

def generate_handicraft_dataset(num_samples=1200):
    rows = []

    for i in range(1, num_samples + 1):
        cat = random.choice(CATEGORIES)
        mat = random.choice(MATERIALS[cat])
        craft = random.choice(CRAFT_TYPES[cat])
        quality = random.choice(['Standard', 'Fine Heritage', 'Masterpiece'])
        quality_factor = {'Standard': 1.0, 'Fine Heritage': 1.25, 'Masterpiece': 1.55}[quality]

        # Base costs depending on craft category
        if cat in ['Handloom & Sarees', 'Jewellery & Brassware']:
            raw_cost = round(random.uniform(800, 3500) * quality_factor, -1)
            labor_cost = round(random.uniform(900, 4000) * quality_factor, -1)
            packaging_cost = round(random.uniform(80, 250), -1)
            other_cost = round(random.uniform(50, 200), -1)
        elif cat in ['Woodcraft & Carvings', 'Pottery & Terracotta']:
            raw_cost = round(random.uniform(150, 800) * quality_factor, -1)
            labor_cost = round(random.uniform(250, 1200) * quality_factor, -1)
            packaging_cost = round(random.uniform(50, 150), -1)
            other_cost = round(random.uniform(30, 100), -1)
        else:
            raw_cost = round(random.uniform(100, 500) * quality_factor, -1)
            labor_cost = round(random.uniform(150, 600) * quality_factor, -1)
            packaging_cost = round(random.uniform(30, 100), -1)
            other_cost = round(random.uniform(20, 80), -1)

        total_cost = raw_cost + labor_cost + packaging_cost + other_cost

        # Market signals
        demand_score = random.randint(1, 10)
        demand_markup = 1.0 + (demand_score - 5) * 0.04

        # Fair margin between 25% and 65% plus demand modulation
        base_markup = random.uniform(1.30, 1.60)
        avg_market_price = round(total_cost * base_markup * demand_markup, -1)
        competitor_price = round(avg_market_price * random.uniform(0.92, 1.10), -1)

        # Target selling price (realistic blend with market average and artisan premium)
        selling_price = round((total_cost * 0.45 + avg_market_price * 0.35 + competitor_price * 0.20), -1)

        # Ensure sellingPrice is never below totalCost + 15%
        min_viable_price = round(total_cost * 1.15, -1)
        if selling_price < min_viable_price:
            selling_price = min_viable_price

        rows.append({
            'productId': f'KS-PROD-{i:04d}',
            'category': cat,
            'material': mat,
            'craftType': craft,
            'quality': quality,
            'rawMaterialCost': raw_cost,
            'laborCost': labor_cost,
            'packagingCost': packaging_cost,
            'otherCost': other_cost,
            'totalCost': total_cost,
            'competitorPrice': competitor_price,
            'averageMarketPrice': avg_market_price,
            'demandScore': demand_score,
            'sellingPrice': selling_price
        })

    df = pd.DataFrame(rows)
    return df

if __name__ == '__main__':
    data_dir = os.path.join(os.path.dirname(__file__), '../data')
    os.makedirs(data_dir, exist_ok=True)
    df = generate_handicraft_dataset(1500)
    output_path = os.path.join(data_dir, 'handicraft_pricing.csv')
    df.to_csv(output_path, index=False)
    print(f'[Dataset] Successfully generated {len(df)} samples at {output_path}')
    print(df.head(3))

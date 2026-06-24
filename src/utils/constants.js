export const INVENTORY_CATEGORIES = {
    'Meat and Protein': { icon: 'fa-drumstick-bite', defaultUnit: 'Kilogram (kg)' },
    'Fish and Seafood': { icon: 'fa-fish', defaultUnit: 'Kilogram (kg)' },
    'Eggs and Dairy': { icon: 'fa-cheese', defaultUnit: 'Unit (unit)' },
    'Vegetables': { icon: 'fa-carrot', defaultUnit: 'Kilogram (kg)' },
    'Fruits': { icon: 'fa-apple-whole', defaultUnit: 'Kilogram (kg)' },
    'Grains and Cereals': { icon: 'fa-wheat-awn', defaultUnit: 'Kilogram (kg)' },
    'Legumes': { icon: 'fa-seedling', defaultUnit: 'Kilogram (kg)' },
    'Bakery and Dough': { icon: 'fa-bread-slice', defaultUnit: 'Piece (pc)' },
    'Herbs and Spices': { icon: 'fa-leaf', defaultUnit: 'Gram (g)' },
    'Oils and Fats': { icon: 'fa-oil-can', defaultUnit: 'Liter (l)' },
    'Sweeteners': { icon: 'fa-cubes-stacked', defaultUnit: 'Kilogram (kg)' },
    'Sauces and Dressings': { icon: 'fa-bottle-droplet', defaultUnit: 'Liter (l)' },
    'Canned and Preserved Foods': { icon: 'fa-jar', defaultUnit: 'Can' },
    'Beverages': { icon: 'fa-wine-bottle', defaultUnit: 'Liter (l)' },
    'Nuts and Seeds': { icon: 'fa-seedling', defaultUnit: 'Kilogram (kg)' },
    'Frozen Foods': { icon: 'fa-snowflake', defaultUnit: 'Package' },
    'Snacks and Sweets': { icon: 'fa-cookie-bite', defaultUnit: 'Package' }
};

export const MEASUREMENT_UNITS = [
    'Gram (g)',
    'Kilogram (kg)',
    'Milliliter (ml)',
    'Liter (l)',
    'Unit (unit)',
    'Piece (pc)',
    'Cup',
    'Tablespoon (tbsp)',
    'Teaspoon (tsp)',
    'Pound (lb)',
    'Ounce (oz)',
    'Can',
    'Bottle',
    'Package',
    'Box',
    'Bag',
    'Dozen',
    'Serving',
    'Slice',
    'Bunch',
    'Clove (garlic)'
];

export const DUMMY_INVENTORY_DATA = [
    { name: 'Tomato', icon: INVENTORY_CATEGORIES['Fruits'].icon, stockText: '800/1000', stockPercent: '80%', progressClass: 'safe', progressWidth: '80%', unit: 'Unit (unit)' },
    { name: 'Sauce', icon: INVENTORY_CATEGORIES['Sauces and Dressings'].icon, stockText: '12/60', stockPercent: '20%', progressClass: 'danger', progressWidth: '20%', unit: 'Kilogram (kg)' },
    { name: 'Cheese', icon: INVENTORY_CATEGORIES['Eggs and Dairy'].icon, stockText: '150/300', stockPercent: '50%', progressClass: 'warning', progressWidth: '50%', unit: 'Serving' },
    { name: 'Noodles', icon: INVENTORY_CATEGORIES['Grains and Cereals'].icon, stockText: '5/8', stockPercent: '62%', progressClass: 'warning', progressWidth: '62%', unit: 'Package' }
];

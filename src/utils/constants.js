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
    'Snacks and Sweets': { icon: 'fa-cookie-bite', defaultUnit: 'Package' },
    'Other': { icon: 'fa-box', defaultUnit: 'Unit (unit)' }
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

export const CURRENCIES = [
    { code: 'GTQ', symbol: 'Q', label: 'GTQ (Q)' },
    { code: 'COP', symbol: '$', label: 'COP ($)' },
    { code: 'MXN', symbol: '$', label: 'MXN ($)' },
    { code: 'USD', symbol: '$', label: 'USD ($)' },
    { code: 'EUR', symbol: '€', label: 'EUR (€)' }
];

export const DISH_CATEGORIES = {
    'ramen': { icon: 'fa-bowl-food', labelKey: 'category.ramen' },
    'burgers': { icon: 'fa-burger', labelKey: 'category.burgers' },
    'bowls': { icon: 'fa-bowl-rice', labelKey: 'category.bowls' },
    'drinks': { icon: 'fa-martini-glass', labelKey: 'category.drinks' },
    'desserts': { icon: 'fa-ice-cream', labelKey: 'category.desserts' },
    'appetizers': { icon: 'fa-cheese', labelKey: 'category.appetizers' },
    'salads': { icon: 'fa-leaf', labelKey: 'category.salads' },
    'soups': { icon: 'fa-mug-hot', labelKey: 'category.soups' },
    'pasta': { icon: 'fa-wheat-awn', labelKey: 'category.pasta' },
    'pizza': { icon: 'fa-pizza-slice', labelKey: 'category.pizza' },
    'sandwiches': { icon: 'fa-bread-slice', labelKey: 'category.sandwiches' },
    'seafood': { icon: 'fa-fish', labelKey: 'category.seafood' },
    'chicken': { icon: 'fa-drumstick-bite', labelKey: 'category.chicken' },
    'steak': { icon: 'fa-bacon', labelKey: 'category.steak' },
    'breakfast': { icon: 'fa-egg', labelKey: 'category.breakfast' },
    'vegetarian': { icon: 'fa-seedling', labelKey: 'category.vegetarian' },
    'vegan': { icon: 'fa-carrot', labelKey: 'category.vegan' },
    'kids': { icon: 'fa-child', labelKey: 'category.kids' },
    'combos': { icon: 'fa-utensils', labelKey: 'category.combos' },
    'sides': { icon: 'fa-french-fries', labelKey: 'category.sides' },
    'specials': { icon: 'fa-star', labelKey: 'category.specials' },
    'other': { icon: 'fa-utensils', labelKey: 'category.other' }
};

export const PROFIT_MARGIN = 0.30;

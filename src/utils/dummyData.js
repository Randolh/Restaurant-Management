export const getDummyData = () => {
    const now = Date.now();
    const past1 = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago
    const past2 = Date.now() - 24 * 60 * 60 * 1000; // 1 day ago

    const dummyInventory = [
        { id: 'inv_1', name: 'Tomate', category: 'Vegetables', stock: 120, minStock: 50, cost: 0.5, unit: 'Kilogram (kg)', icon: 'fa-carrot' },
        { id: 'inv_2', name: 'Cebolla', category: 'Vegetables', stock: 80, minStock: 30, cost: 0.3, unit: 'Kilogram (kg)', icon: 'fa-carrot' },
        { id: 'inv_3', name: 'Carne de Res', category: 'Meat and Protein', stock: 45, minStock: 20, cost: 8.5, unit: 'Kilogram (kg)', icon: 'fa-drumstick-bite' },
        { id: 'inv_4', name: 'Pollo', category: 'Meat and Protein', stock: 60, minStock: 25, cost: 4.2, unit: 'Kilogram (kg)', icon: 'fa-drumstick-bite' },
        { id: 'inv_5', name: 'Queso Cheddar', category: 'Eggs and Dairy', stock: 15, minStock: 20, cost: 6.0, unit: 'Kilogram (kg)', icon: 'fa-cheese' },
        { id: 'inv_6', name: 'Pan de Hamburguesa', category: 'Bakery and Dough', stock: 100, minStock: 50, cost: 0.2, unit: 'Unit (unit)', icon: 'fa-bread-slice' },
        { id: 'inv_7', name: 'Lechuga', category: 'Vegetables', stock: 30, minStock: 15, cost: 0.4, unit: 'Unit (unit)', icon: 'fa-leaf' },
        { id: 'inv_8', name: 'Papas', category: 'Vegetables', stock: 200, minStock: 100, cost: 1.2, unit: 'Kilogram (kg)', icon: 'fa-seedling' }
    ];

    const dummyDishes = [
        { 
            id: 'dish_1', 
            name: 'Hamburguesa Clásica', 
            category: 'burgers', 
            price: 8.99, 
            cost: 3.50,
            isAvailable: true,
            image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=300&q=80',
            recipe: [
                { id: 'inv_6', name: 'Pan de Hamburguesa', unit: 'Unit (unit)', qty: 1 },
                { id: 'inv_3', name: 'Carne de Res', unit: 'Kilogram (kg)', qty: 1 },
                { id: 'inv_7', name: 'Lechuga', unit: 'Unit (unit)', qty: 1 },
                { id: 'inv_1', name: 'Tomate', unit: 'Kilogram (kg)', qty: 1 }
            ]
        },
        { 
            id: 'dish_2', 
            name: 'Cheeseburger Doble', 
            category: 'burgers', 
            price: 12.99, 
            cost: 5.00,
            isAvailable: true,
            image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=300&q=80',
            recipe: [
                { id: 'inv_6', name: 'Pan de Hamburguesa', unit: 'Unit (unit)', qty: 1 },
                { id: 'inv_3', name: 'Carne de Res', unit: 'Kilogram (kg)', qty: 2 },
                { id: 'inv_5', name: 'Queso Cheddar', unit: 'Kilogram (kg)', qty: 1 }
            ]
        },
        { 
            id: 'dish_3', 
            name: 'Papas Fritas', 
            category: 'sides', 
            price: 3.99, 
            cost: 0.80,
            isAvailable: true,
            image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=300&q=80',
            recipe: [
                { id: 'inv_8', name: 'Papas', unit: 'Kilogram (kg)', qty: 1 }
            ]
        }
    ];

    const dummyOrders = [
        // Incomplete orders (current time)
        {
            id: 'ORD-1001',
            customerName: 'Juan Pérez',
            status: 'pending',
            createdAt: now,
            items: [
                { id: 'dish_1', name: 'Hamburguesa Clásica', price: 8.99, qty: 2 },
                { id: 'dish_3', name: 'Papas Fritas', price: 3.99, qty: 1 }
            ],
            subtotal: 21.97,
            tax: 0.00,
            total: 21.97,
            notes: 'Sin cebolla'
        },
        {
            id: 'ORD-1002',
            customerName: 'María García',
            status: 'in-progress',
            createdAt: now,
            items: [
                { id: 'dish_2', name: 'Cheeseburger Doble', price: 12.99, qty: 1 }
            ],
            subtotal: 12.99,
            tax: 0.00,
            total: 12.99,
            notes: ''
        },
        {
            id: 'ORD-1003',
            customerName: 'Carlos López',
            status: 'ready',
            createdAt: now,
            items: [
                { id: 'dish_1', name: 'Hamburguesa Clásica', price: 8.99, qty: 1 },
                { id: 'dish_3', name: 'Papas Fritas', price: 3.99, qty: 2 }
            ],
            subtotal: 16.97,
            tax: 0.00,
            total: 16.97,
            notes: 'Para llevar'
        },
        // Completed & Cancelled orders (past time)
        {
            id: 'ORD-0999',
            customerName: 'Ana Martínez',
            status: 'completed',
            createdAt: past1,
            completedAt: past1,
            items: [
                { id: 'dish_2', name: 'Cheeseburger Doble', price: 12.99, qty: 2 }
            ],
            subtotal: 25.98,
            tax: 0.00,
            total: 25.98,
            notes: ''
        },
        {
            id: 'ORD-0998',
            customerName: 'Roberto Gómez',
            status: 'completed',
            createdAt: past2,
            completedAt: past2,
            items: [
                { id: 'dish_1', name: 'Hamburguesa Clásica', price: 8.99, qty: 1 },
                { id: 'dish_3', name: 'Papas Fritas', price: 3.99, qty: 1 }
            ],
            subtotal: 12.98,
            tax: 0.00,
            total: 12.98,
            notes: ''
        },
        {
            id: 'ORD-0997',
            customerName: 'Luis Fernández',
            status: 'cancelled',
            createdAt: past2,
            completedAt: past2,
            items: [
                { id: 'dish_3', name: 'Papas Fritas', price: 3.99, qty: 3 }
            ],
            subtotal: 11.97,
            tax: 0.00,
            total: 11.97,
            notes: 'Cliente canceló'
        }
    ];

    const dummyInvoices = {
        'ORD-0999': {
            method: 'cash',
            timestamp: new Date(past1).toISOString(),
            amountReceived: 20.00,
            change: 5.01
        },
        'ORD-0998': {
            method: 'card',
            timestamp: new Date(past2).toISOString()
        },
        'ORD-0997': {
            method: 'cash',
            timestamp: new Date(past2).toISOString(),
            amountReceived: 12.00,
            change: 0.03
        }
    };

    return { dummyInventory, dummyDishes, dummyOrders, dummyInvoices };
};

import { getLocal, setLocal } from './storage.js';

const locales = {
    en: {
        'btn.add': 'Add Item',
        'btn.cancel': 'Cancel',
        'btn.accept': 'Accept',
        'btn.confirm': 'Confirm',
        'btn.delete': 'Delete',
        'btn.saveChanges': 'Save Changes',
        'modal.confirmTitle': 'Confirm Action',

        'inventory.title': 'Inventory',
        'inventory.kpi.total': 'Total Items',
        'inventory.kpi.lowStock': 'Low Stock',
        'inventory.kpi.value': 'Inventory Value',

        'table.empty': 'No items found in inventory. Click "Add Item" to start.',
        'table.showing': 'Showing {start}-{end} of {total}',
        'table.deleteConfirm': 'Are you sure you want to delete {name}?',
        'table.col.name': 'Name',
        'table.col.stock': 'Stock Level',
        'table.col.unit': 'Unit',
        'table.col.actions': 'Actions',

        'itemModal.title.add': 'Add Ingredient',
        'itemModal.title.edit': 'Edit Ingredient',
        'itemModal.label.name': 'Name',
        'itemModal.placeholder.name': 'e.g. Tomato',
        'itemModal.label.category': 'Category',
        'itemModal.label.unit': 'Unit measure',
        'itemModal.label.autoUnit': 'Auto-select default unit',
        'itemModal.label.stock': 'Initial stock',
        'itemModal.label.minStock': 'Min Stock',
        'itemModal.label.cost': 'Unit Cost ($)',
        'itemModal.err.name': '• Item name is required.',
        'itemModal.err.stock': '• Initial stock must be a valid number strictly greater than 0.',
        'itemModal.err.minStock': '• Min stock must be a valid number greater than or equal to 0.',
        'itemModal.err.cost': '• Unit Cost must be a valid number strictly greater than 0.',

        'stockModal.title': 'Add Stock: {name}',
        'stockModal.label.qty': 'Quantity to Add',
        'stockModal.placeholder.qty': 'e.g. 50',
        'stockModal.err.qty': '• Quantity must be a valid number strictly greater than 0.',
        'stockModal.err.notFound': '• Item not found.'
    },
    es: {
        'btn.add': 'Añadir',
        'btn.cancel': 'Cancelar',
        'btn.accept': 'Aceptar',
        'btn.confirm': 'Confirmar',
        'btn.delete': 'Eliminar',
        'btn.saveChanges': 'Guardar Cambios',
        'modal.confirmTitle': 'Confirmar Acción',

        'inventory.title': 'Inventario',
        'inventory.kpi.total': 'Total de Productos',
        'inventory.kpi.lowStock': 'Stock Bajo',
        'inventory.kpi.value': 'Valor del Inventario',

        'table.empty': 'No hay productos en el inventario. Haz clic en "Añadir" para comenzar.',
        'table.showing': 'Mostrando {start}-{end} de {total}',
        'table.deleteConfirm': '¿Estás seguro de que deseas eliminar {name}?',
        'table.col.name': 'Nombre',
        'table.col.stock': 'Nivel de Stock',
        'table.col.unit': 'Unidad',
        'table.col.actions': 'Acciones',

        'itemModal.title.add': 'Añadir Ingrediente',
        'itemModal.title.edit': 'Editar Ingrediente',
        'itemModal.label.name': 'Nombre',
        'itemModal.placeholder.name': 'ej. Tomate',
        'itemModal.label.category': 'Categoría',
        'itemModal.label.unit': 'Unidad de medida',
        'itemModal.label.autoUnit': 'Auto-seleccionar unidad por defecto',
        'itemModal.label.stock': 'Stock inicial',
        'itemModal.label.minStock': 'Stock Mínimo',
        'itemModal.label.cost': 'Costo Unitario ($)',
        'itemModal.err.name': '• El nombre es obligatorio.',
        'itemModal.err.stock': '• El stock debe ser mayor a 0.',
        'itemModal.err.minStock': '• El stock mínimo no puede ser negativo.',
        'itemModal.err.cost': '• El costo debe ser mayor a 0.',

        'stockModal.title': 'Añadir Stock: {name}',
        'stockModal.label.qty': 'Cantidad a Añadir',
        'stockModal.placeholder.qty': 'ej. 50',
        'stockModal.err.qty': '• La cantidad debe ser mayor a 0.',
        'stockModal.err.notFound': '• Producto no encontrado.'
    }
};

let currentLang = getLocal('appLang', false) || 'en';

export const setLang = (lang) => {
    if (locales[lang]) {
        currentLang = lang;
        setLocal('appLang', lang, false);
        window.dispatchEvent(new CustomEvent('langChanged'));
    }
};

export const getLang = () => currentLang;

export const t = (key, params = {}) => {
    let text = locales[currentLang]?.[key] || locales['en']?.[key] || key;
    
    Object.keys(params).forEach(param => {
        text = text.replace(new RegExp(`{${param}}`, 'g'), params[param]);
    });
    
    return text;
};

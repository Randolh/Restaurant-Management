import { emitEvent, onEvent } from '../../utils/events.js';
import { getLocal, setLocal } from '../../utils/storage.js';
import { DISH_CATEGORIES } from '../../utils/constants.js';
import { t } from '../../utils/i18n.js';
import showToast from '../ui/Toast.js';
import RecipeBuilder from './RecipeBuilder.js';
import ImagePreview from './ImagePreview.js';
import FormError from '../ui/FormError.js';
import { validateDishForm, isValidImageUrl } from '../../utils/validators.js';

export default function AddDishModal() {
    const wrapper = document.createElement('div');
    
    // Instantiate sub-components
    const recipeBuilder = RecipeBuilder();
    const imagePreview = ImagePreview();
    
    // Carousel State
    let currentSlide = 0;
    
    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.id = 'add-dish-modal-toggle';
    toggle.className = 'modal-toggle';
    toggle.hidden = true;
    wrapper.appendChild(toggle);

    const modal = document.createElement('div');
    modal.className = 'modal';

    const overlay = document.createElement('label');
    overlay.htmlFor = 'add-dish-modal-toggle';
    overlay.className = 'modal-overlay';
    modal.appendChild(overlay);

    const modalContainer = document.createElement('div');
    modalContainer.className = 'modal-container add-dish-modal-container';

    // Header
    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header modal-header-carousel';
    
    const titleRow = document.createElement('div');
    titleRow.className = 'modal-title-row';
    
    const titleEl = document.createElement('h2');
    titleEl.id = 'add-dish-modal-title';
    titleEl.className = 'modal-title';
    
    const closeLbl = document.createElement('label');
    closeLbl.htmlFor = 'add-dish-modal-toggle';
    closeLbl.className = 'modal-close';
    const closeIcon = document.createElement('i');
    closeIcon.className = 'fa-solid fa-xmark';
    closeLbl.appendChild(closeIcon);
    
    titleRow.appendChild(titleEl);
    titleRow.appendChild(closeLbl);
    
    const stepIndicator = document.createElement('div');
    stepIndicator.className = 'step-indicator';
    stepIndicator.textContent = t('dishModal.step1') || 'Step 1 of 2: Details';
    
    modalHeader.appendChild(titleRow);
    modalHeader.appendChild(stepIndicator);
    modalContainer.appendChild(modalHeader);

    // Form
    const form = document.createElement('form');
    form.id = 'add-dish-form';
    form.className = 'modal-body';
    form.noValidate = true;

    // Form Error
    const formError = FormError();
    form.appendChild(formError.element);

    // Carousel Viewport
    const carouselViewport = document.createElement('div');
    carouselViewport.className = 'carousel-viewport';
    
    const carouselTrack = document.createElement('div');
    carouselTrack.className = 'carousel-track';
    
    // SLIDE 1: Details
    const slide1 = document.createElement('div');
    slide1.className = 'carousel-slide';

    // Row 1
    const formRow1 = document.createElement('div');
    formRow1.className = 'form-row';

    const col1 = document.createElement('div');
    col1.className = 'form-col';

    const groupName = document.createElement('div');
    groupName.className = 'form-group';
    const labelName = document.createElement('label');
    labelName.className = 'form-label';
    labelName.textContent = t('dishModal.name');
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.id = 'dish-name';
    inputName.className = 'form-control';
    inputName.placeholder = t('dishModal.placeholder.name') || 'e.g. Tonkotsu Ramen';
    inputName.required = true;
    groupName.appendChild(labelName);
    groupName.appendChild(inputName);

    const groupImage = document.createElement('div');
    groupImage.className = 'form-group';
    const labelImage = document.createElement('label');
    labelImage.className = 'form-label';
    labelImage.textContent = t('dishModal.image');
    const inputImage = document.createElement('input');
    inputImage.type = 'url';
    inputImage.id = 'dish-image';
    inputImage.className = 'form-control';
    inputImage.placeholder = t('dishModal.placeholder.image') || 'https://www...';
    
    // Connect URL input to ImagePreview component
    inputImage.addEventListener('input', (e) => {
        imagePreview.setPreviewUrl(e.target.value.trim());
    });

    groupImage.appendChild(labelImage);
    groupImage.appendChild(inputImage);

    col1.appendChild(groupName);
    col1.appendChild(groupImage);

    // Wrap image preview in a form-group to align with input
    const groupImagePreview = document.createElement('div');
    groupImagePreview.className = 'form-group';
    const emptyLabel = document.createElement('label');
    emptyLabel.className = 'form-label';
    emptyLabel.innerHTML = '&nbsp;';
    groupImagePreview.appendChild(emptyLabel);
    groupImagePreview.appendChild(imagePreview.element);

    formRow1.appendChild(col1);
    formRow1.appendChild(groupImagePreview);
    slide1.appendChild(formRow1);

    const divider1 = document.createElement('hr');
    divider1.className = 'form-divider';
    slide1.appendChild(divider1);

    // Row 2
    const formRow2 = document.createElement('div');
    formRow2.className = 'form-row';

    const colCat = document.createElement('div');
    colCat.className = 'form-col';
    const groupCat = document.createElement('div');
    groupCat.className = 'form-group';
    const labelCat = document.createElement('label');
    labelCat.className = 'form-label';
    labelCat.textContent = t('dishModal.category');
    const selectCat = document.createElement('select');
    selectCat.id = 'dish-category';
    selectCat.className = 'form-control';
    selectCat.required = true;
    Object.entries(DISH_CATEGORIES).forEach(([catKey, obj]) => {
        const opt = document.createElement('option');
        opt.value = catKey;
        opt.textContent = t(obj.labelKey) || catKey;
        selectCat.appendChild(opt);
    });
    groupCat.appendChild(labelCat);
    groupCat.appendChild(selectCat);
    colCat.appendChild(groupCat);

    const colPrice = document.createElement('div');
    colPrice.className = 'form-col';
    const groupPrice = document.createElement('div');
    groupPrice.className = 'form-group';
    const labelPrice = document.createElement('label');
    labelPrice.className = 'form-label';
    labelPrice.textContent = t('dishModal.price');
    const inputPrice = document.createElement('input');
    inputPrice.type = 'number';
    inputPrice.id = 'dish-price';
    inputPrice.className = 'form-control';
    inputPrice.min = '0';
    inputPrice.step = '0.01';
    inputPrice.placeholder = t('dishModal.placeholder.price') || '10.00';
    inputPrice.required = true;
    groupPrice.appendChild(labelPrice);
    groupPrice.appendChild(inputPrice);
    colPrice.appendChild(groupPrice);

    formRow2.appendChild(colCat);
    formRow2.appendChild(colPrice);
    slide1.appendChild(formRow2);

    const groupDesc = document.createElement('div');
    groupDesc.className = 'form-group';
    const labelDesc = document.createElement('label');
    labelDesc.className = 'form-label';
    labelDesc.textContent = t('dishModal.desc');
    const inputDesc = document.createElement('textarea');
    inputDesc.id = 'dish-desc';
    inputDesc.className = 'form-control';
    inputDesc.rows = '2';
    inputDesc.placeholder = t('dishModal.placeholder.desc') || 'Describe the dish...';
    groupDesc.appendChild(labelDesc);
    groupDesc.appendChild(inputDesc);
    slide1.appendChild(groupDesc);

    const groupAvail = document.createElement('div');
    groupAvail.className = 'form-group checkbox-group';
    const inputAvail = document.createElement('input');
    inputAvail.type = 'checkbox';
    inputAvail.id = 'dish-available';
    inputAvail.checked = true;
    const labelAvail = document.createElement('label');
    labelAvail.htmlFor = 'dish-available';
    labelAvail.textContent = t('dishModal.available');
    groupAvail.appendChild(inputAvail);
    groupAvail.appendChild(labelAvail);
    slide1.appendChild(groupAvail);

    // SLIDE 2: Ingredients
    const slide2 = document.createElement('div');
    slide2.className = 'carousel-slide';
    
    const recipeHeader = document.createElement('h3');
    recipeHeader.className = 'recipe-header';
    recipeHeader.textContent = t('dishModal.ingredients');
    slide2.appendChild(recipeHeader);

    // Append RecipeBuilder component
    slide2.appendChild(recipeBuilder.element);
    
    carouselTrack.appendChild(slide1);
    carouselTrack.appendChild(slide2);
    carouselViewport.appendChild(carouselTrack);
    form.appendChild(carouselViewport);
    modalContainer.appendChild(form);

    const modalFooter = document.createElement('div');
    modalFooter.className = 'modal-footer';
    
    const cancelLbl = document.createElement('label');
    cancelLbl.htmlFor = 'add-dish-modal-toggle';
    cancelLbl.className = 'btn-secondary';
    cancelLbl.textContent = t('btn.cancel');
    
    const backBtn = document.createElement('button');
    backBtn.type = 'button';
    backBtn.className = 'btn-secondary';
    backBtn.textContent = t('btn.back') || 'Back';
    backBtn.style.display = 'none';
    
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'btn-primary';
    nextBtn.textContent = t('btn.next') || 'Next';
    
    const saveBtn = document.createElement('button');
    saveBtn.type = 'submit';
    saveBtn.setAttribute('form', 'add-dish-form');
    saveBtn.className = 'btn-primary';
    saveBtn.id = 'add-dish-modal-save-btn';
    saveBtn.style.display = 'none';
    
    modalFooter.appendChild(cancelLbl);
    modalFooter.appendChild(backBtn);
    modalFooter.appendChild(nextBtn);
    modalFooter.appendChild(saveBtn);
    modalContainer.appendChild(modalFooter);

    modal.appendChild(modalContainer);
    wrapper.appendChild(modal);

    // --- Carousel Navigation Logic ---
    const updateCarousel = () => {
        carouselTrack.style.transform = `translateX(-${currentSlide * 50}%)`;
        if (currentSlide === 0) {
            stepIndicator.textContent = t('dishModal.step1') || 'Step 1 of 2: Details';
            backBtn.style.display = 'none';
            cancelLbl.style.display = '';
            nextBtn.style.display = '';
            saveBtn.style.display = 'none';
        } else {
            stepIndicator.textContent = t('dishModal.step2') || 'Step 2 of 2: Ingredients';
            backBtn.style.display = '';
            cancelLbl.style.display = 'none';
            nextBtn.style.display = 'none';
            saveBtn.style.display = '';
        }
    };

    nextBtn.addEventListener('click', async () => {
        formError.hide();
        const name = inputName.value.trim();
        const price = parseFloat(inputPrice.value);
        const image = inputImage.value.trim();

        const validation = validateDishForm({ name, price });
        if (!validation.isValid) {
            formError.show(validation.errors);
            return;
        }

        if (image) {
            const isValidImage = await isValidImageUrl(image);
            if (!isValidImage) {
                formError.show([t('dishModal.err.image') || 'Invalid image URL or image failed to load.']);
                return;
            }
        }
        
        currentSlide = 1;
        updateCarousel();
    });

    backBtn.addEventListener('click', () => {
        formError.hide();
        currentSlide = 0;
        updateCarousel();
    });

    // --- Form Submission ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        formError.hide();
        
        // Validation is already done on 'Next' step, but to be absolutely safe:
        const name = inputName.value.trim();
        const category = selectCat.value;
        const price = parseFloat(inputPrice.value);
        const image = inputImage.value.trim();
        const description = inputDesc.value.trim();
        const isAvailable = inputAvail.checked;

        const validation = validateDishForm({ name, price });
        if (!validation.isValid) {
            formError.show(validation.errors);
            currentSlide = 0;
            updateCarousel();
            return;
        }

        if (image) {
            const isValidImage = await isValidImageUrl(image);
            if (!isValidImage) {
                formError.show([t('dishModal.err.image') || 'Invalid image URL or image failed to load.']);
                currentSlide = 0;
                updateCarousel();
                return;
            }
        }
        
        const editId = saveBtn.dataset.editId;
        const currentRecipe = recipeBuilder.getRecipe();
        
        if (currentRecipe.length === 0) {
            formError.show([t('dishModal.err.ingredients') || 'You must add at least one ingredient.']);
            return;
        }
        
        const dishes = getLocal('dishesItems', true) || [];

        if (editId) {
            const index = dishes.findIndex(d => d.id == editId);
            if (index !== -1) {
                dishes[index] = { 
                    ...dishes[index], 
                    name, category, price, image, description, isAvailable, 
                    recipe: currentRecipe,
                    lastUpdated: new Date().toISOString() 
                };
            }
        } else {
            dishes.push({
                id: Date.now().toString(),
                name,
                category,
                price,
                image,
                description,
                isAvailable,
                recipe: currentRecipe,
                createdAt: new Date().toISOString(),
                deleted: false
            });
        }
        
        setLocal('dishesItems', dishes, true);
        emitEvent('dishesUpdated');
        
        toggle.checked = false;
        form.reset();
        formError.hide();
        imagePreview.reset();
        currentSlide = 0;
        updateCarousel();
    });

    // --- Event Listeners for opening modal ---
    onEvent('openAddDishModal', () => {
        titleEl.textContent = t('dishModal.title.add') || 'Add New Dish';
        saveBtn.textContent = t('dishes.btn.save') || 'Save Dish';
        saveBtn.dataset.editId = '';
        
        form.reset();
        formError.hide();
        imagePreview.reset();
        recipeBuilder.setInventoryItems(getLocal('inventoryItems', true) || []);
        recipeBuilder.setRecipe([]);
        
        currentSlide = 0;
        updateCarousel();
    });

    onEvent('openEditDishModal', (e) => {
        const dish = e.detail.dish;
        titleEl.textContent = t('dishModal.title.edit') || 'Edit Dish';
        saveBtn.textContent = t('btn.saveChanges') || 'Save Changes';
        saveBtn.dataset.editId = dish.id;

        inputName.value = dish.name || '';
        selectCat.value = dish.category ? dish.category.toLowerCase() : 'ramen';
        inputPrice.value = dish.price || '';
        inputImage.value = dish.image || '';
        inputDesc.value = dish.description || '';
        inputAvail.checked = dish.isAvailable !== undefined ? dish.isAvailable : true;

        formError.hide();
        imagePreview.setPreviewUrl(dish.image || '');
        
        recipeBuilder.setInventoryItems(getLocal('inventoryItems', true) || []);
        recipeBuilder.setRecipe(dish.recipe || []);
        
        currentSlide = 0;
        updateCarousel();
    });

    return wrapper;
}

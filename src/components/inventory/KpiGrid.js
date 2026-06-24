let savedCarouselIndex = 0;

export default function KpiGrid(kpis) {
    const container = document.createElement('div');
    container.className = 'kpi-container';

    // Desktop Grid View
    const kpiGrid = document.createElement('div');
    kpiGrid.className = 'kpi-grid kpi-grid-desktop';

    // Mobile Carousel View
    const kpiCarousel = document.createElement('div');
    kpiCarousel.className = 'kpi-carousel-mobile';
    
    let currentIndex = savedCarouselIndex;
    if (currentIndex >= kpis.length) {
        currentIndex = 0;
    }
    
    const activeIndex = kpis.findIndex(k => k.active);
    if (activeIndex !== -1) {
        currentIndex = activeIndex;
        savedCarouselIndex = activeIndex;
    }

    const createCard = (kpi) => {
        const card = document.createElement('div');
        card.className = 'kpi-card';
        
        if (kpi.clickable) {
            card.classList.add('clickable');
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                if (kpi.onClick) kpi.onClick();
            });
        }
        
        if (kpi.active) {
            card.classList.add('kpi-active');
        }

        const h3 = document.createElement('h3');
        h3.textContent = kpi.title;
        card.appendChild(h3);

        const val = document.createElement('div');
        val.className = 'kpi-value';
        val.textContent = kpi.value;
        card.appendChild(val);

        return card;
    };
    
    // Populate Desktop Grid
    kpis.forEach(kpi => {
        kpiGrid.appendChild(createCard(kpi));
    });

    // Setup Mobile Carousel
    const btnLeft = document.createElement('button');
    btnLeft.className = 'kpi-carousel-btn';
    btnLeft.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    
    const btnRight = document.createElement('button');
    btnRight.className = 'kpi-carousel-btn';
    btnRight.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    
    const carouselContent = document.createElement('div');
    carouselContent.className = 'kpi-carousel-content';
    
    const updateCarousel = () => {
        carouselContent.textContent = '';
        if (kpis.length > 0) {
            carouselContent.appendChild(createCard(kpis[currentIndex]));
        }
    };
    
    btnLeft.addEventListener('click', () => {
        if (kpis.length > 0) {
            currentIndex = (currentIndex - 1 + kpis.length) % kpis.length;
            savedCarouselIndex = currentIndex;
            updateCarousel();
        }
    });
    
    btnRight.addEventListener('click', () => {
        if (kpis.length > 0) {
            currentIndex = (currentIndex + 1) % kpis.length;
            savedCarouselIndex = currentIndex;
            updateCarousel();
        }
    });
    
    updateCarousel();
    
    kpiCarousel.appendChild(btnLeft);
    kpiCarousel.appendChild(carouselContent);
    kpiCarousel.appendChild(btnRight);
    
    container.appendChild(kpiGrid);
    container.appendChild(kpiCarousel);
    
    return container;
}

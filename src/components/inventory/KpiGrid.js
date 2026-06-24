export default function KpiGrid(kpis) {
    const kpiGrid = document.createElement('div');
    kpiGrid.className = 'kpi-grid';
    
    kpis.forEach(kpi => {
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

        kpiGrid.appendChild(card);
    });
    
    return kpiGrid;
}

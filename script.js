document.addEventListener('DOMContentLoaded', function() {
    const planOptions = {
        'Duración': {
            icon: 'calendar-alt',
            options: [
                { name: '1 Año', price: 6000 },
                { name: '6 Meses', price: 3000 },
                { name: '3 Meses', price: 1500 },
                { name: '1 Mes', price: 500 }
            ]
        },
        'Tipo de Sitio': {
            icon: 'laptop-code',
            options: [
                { name: 'Tienda Online', price: 5000 },
                { name: 'Servicio Local', price: 1500 }
            ]
        },
        'Diseño': {
            icon: 'paint-brush',
            options: [
                { name: 'Premium', price: 3000 },
                { name: 'Profesional', price: 2000 },
                { name: 'Estándar', price: 1000 }
            ]
        },
        'Marca De Agua': {
            icon: 'server',
            options: [
                { name: 'Con Marca', price: 0 },
                { name: 'Sin Marca', price: 500 }
            ]
        },
        'Soporte': {
            icon: 'headset',
            options: [
                { name: 'Premium 24/7', price: 2500 },
                { name: 'Estándar 12/5', price: 1500 },
                { name: 'Básico', price: 500 }
            ]
        }
    };

    const appState = {
        selectedOptions: {}
    };

    const DOM = {
        optionsContainer: document.querySelector('.options-container'),
        selectedOptionsContainer: document.querySelector('.selected-options'),
        totalPriceElement: document.querySelector('.total-price'),
        whatsappBtn: document.getElementById('whatsapp-btn'),
        copyBtn: document.getElementById('copy-btn'),
        notification: document.getElementById('notification')
    };

    function init() {
        renderOptions();
        setupEventListeners();
        selectCheapestOptions();
    }

    function renderOptions() {
        let html = '';
        for (const [category, data] of Object.entries(planOptions)) {
            html += `<div class="option-category">
                <h3><i class="fas fa-${data.icon}"></i> ${category}</h3>
                <div class="options-list">${data.options.map(option => `
                    <div class="option-item ${appState.selectedOptions[category]?.name === option.name ? 'selected' : ''}" 
                        data-category="${category}" data-name="${option.name}" data-price="${option.price}">
                        <div class="option-item-content">
                            <div class="option-item-main">
                                <h4>${option.name}</h4>
                                <div class="option-price">$${option.price} CUP</div>
                            </div>
                        </div>
                    </div>`).join('')}
                </div>
            </div>`;
        }
        DOM.optionsContainer.innerHTML = html;
        updateSummary();
    }

    function setupEventListeners() {
        DOM.optionsContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.option-item');
            if (option) selectOption(option);
        });

        DOM.whatsappBtn.addEventListener('click', () => sendViaWhatsApp('+5350369270'));
        DOM.copyBtn.addEventListener('click', copySummary);
    }

    function selectOption(optionElement) {
        const category = optionElement.dataset.category;
        document.querySelectorAll(`.option-item[data-category="${category}"]`).forEach(item => {
            item.classList.remove('selected');
        });
        optionElement.classList.add('selected');
        appState.selectedOptions[category] = { 
            name: optionElement.dataset.name, 
            price: parseInt(optionElement.dataset.price) 
        };
        updateSummary();
    }

    function selectCheapestOptions() {
        for (const [category, data] of Object.entries(planOptions)) {
            const cheapestOption = data.options.reduce((prev, curr) => 
                prev.price < curr.price ? prev : curr
            );
            appState.selectedOptions[category] = {
                name: cheapestOption.name,
                price: cheapestOption.price
            };
        }
        renderOptions();
    }

    function updateSummary() {
        let total = 0;
        let html = '';
        for (const [category, data] of Object.entries(planOptions)) {
            const selectedOption = appState.selectedOptions[category];
            total += selectedOption?.price || 0;
            if (selectedOption?.price > 0) {
                html += `<div class="selected-option">
                    <span>${category}:</span>
                    <span>$${selectedOption.price} CUP</span>
                </div>`;
            }
        }
        DOM.selectedOptionsContainer.innerHTML = html || '<p>No hay opciones seleccionadas</p>';
        DOM.totalPriceElement.textContent = `$${total} CUP`;
    }

    function sendViaWhatsApp(phoneNumber) {
        const summary = generateSummary();
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(summary)}`, '_blank');
    }

    function copySummary() {
        navigator.clipboard.writeText(generateSummary()).then(() => {
            showNotification('Resumen copiado al portapapeles', 'success');
        });
    }

    function generateSummary() {
        let summary = `*Resumen del Plan Web - CHP Solutions*\n\n*Opciones seleccionadas:*\n`;
        let total = 0;
        for (const [category, data] of Object.entries(planOptions)) {
            const selectedOption = appState.selectedOptions[category];
            total += selectedOption?.price || 0;
            if (selectedOption?.price > 0) {
                summary += `- ${category}: ${selectedOption.name} ($${selectedOption.price} CUP)\n`;
            }
        }
        return summary + `\n*Total a pagar:* $${total} CUP`;
    }

    function showNotification(message, type) {
        const notification = DOM.notification;
        notification.className = `notification ${type} show`;
        notification.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'times-circle'}"></i> ${message}`;
        setTimeout(() => notification.classList.remove('show'), 5000);
    }

    init();
});
document.addEventListener('DOMContentLoaded', async function() {
    // Cargar datos desde el JSON
    let planOptions = {};
    try {
        const response = await fetch('data.json');
        if (!response.ok) throw new Error('Error al cargar los datos');
        const data = await response.json();
        planOptions = data.planOptions;
    } catch (error) {
        console.error('Error:', error);
        showNotification('Error al cargar los servicios', 'error');
        return;
    }

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
        selectDefaultOptions();
    }

    function renderOptions() {
        let html = '';
        for (const [category, data] of Object.entries(planOptions)) {
            html += `
            <div class="option-category">
                <h3><i class="fas fa-${data.icon}"></i> ${category}</h3>
                <div class="options-list">
                    ${data.options.map(option => `
                    <div class="option-item 
                        ${appState.selectedOptions[category]?.name === option.name ? 'selected' : ''}
                        ${option.featured ? 'featured' : ''}"
                        data-category="${category}" 
                        data-name="${option.name}" 
                        data-price="${option.price}">
                        <div class="option-item-content">
                            <div class="option-item-main">
                                <h4>${option.name}</h4>
                                <div class="option-price">$${option.price.toLocaleString()} CUP</div>
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

    function selectDefaultOptions() {
        for (const [category, data] of Object.entries(planOptions)) {
            // Seleccionar la opción destacada (featured) o la primera si no hay destacada
            const defaultOption = data.options.find(opt => opt.featured) || data.options[0];
            appState.selectedOptions[category] = {
                name: defaultOption.name,
                price: defaultOption.price
            };
        }
        renderOptions();
    }

    function updateSummary() {
        let total = 0;
        let html = '';
        for (const [category, data] of Object.entries(planOptions)) {
            const selectedOption = appState.selectedOptions[category];
            if (selectedOption) {
                total += selectedOption.price;
                html += `
                <div class="selected-option">
                    <span>${category}: ${selectedOption.name}</span>
                    <span>$${selectedOption.price.toLocaleString()} CUP</span>
                </div>`;
            }
        }
        DOM.selectedOptionsContainer.innerHTML = html || '<p>No hay opciones seleccionadas</p>';
        DOM.totalPriceElement.textContent = `$${total.toLocaleString()} CUP`;
    }

    function sendViaWhatsApp(phoneNumber) {
        const summary = generateSummary();
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(summary)}`, '_blank');
    }

    function copySummary() {
        navigator.clipboard.writeText(generateSummary()).then(() => {
            showNotification('Resumen copiado al portapapeles', 'success');
        }).catch(err => {
            console.error('Error al copiar:', err);
            showNotification('Error al copiar', 'error');
        });
    }

    function generateSummary() {
        let summary = `*Resumen del Plan Web - CHP Solutions*\n\n*Opciones seleccionadas:*\n`;
        let total = 0;
        
        for (const [category, data] of Object.entries(planOptions)) {
            const selectedOption = appState.selectedOptions[category];
            if (selectedOption) {
                total += selectedOption.price;
                summary += `➤ ${category}: ${selectedOption.name} - $${selectedOption.price.toLocaleString()} CUP\n`;
            }
        }
        
        summary += `\n*Total a pagar:* $${total.toLocaleString()} CUP\n\n`;
        summary += `*¡Gracias por elegir CHP Solutions!*`;
        
        return summary;
    }

    function showNotification(message, type) {
        const notification = DOM.notification;
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'times-circle'}"></i>
            <span>${message}</span>
        `;
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    init();
});
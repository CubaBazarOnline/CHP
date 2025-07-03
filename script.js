document.addEventListener('DOMContentLoaded', function() {
    // Datos de configuración con precios actualizados y ordenados de mayor a menor
    const planOptions = {
        'Duración': {
            icon: 'calendar-alt',
            options: [
                { name: '1 Año', price: 6000, desc: 'Ahorro a largo plazo con mantenimiento incluido' },
                { name: '6 Meses', price: 3000, desc: 'Opción intermedia con soporte extendido' },
                { name: '3 Meses', price: 1500, desc: 'Perfecto para proyectos temporales' },
                { name: '1 Mes', price: 500, desc: 'Plan mensual estándar' }
            ]
        },
        'Tipo de Sitio': {
            icon: 'laptop-code',
            options: [
                { name: 'Tienda Online', price: 5000, desc: 'Carrito de compras y productos' },
                { name: 'Servicio Local', price: 1500, desc: 'Sitio profesional' },
            ]
        },
        'Diseño': {
            icon: 'paint-brush',
            options: [
                { name: 'Premium', price: 3000, desc: 'Diseño 100% personalizado y único' },
                { name: 'Profesional', price: 2000, desc: 'Plantilla premium modificada' },
                { name: 'Estándar', price: 1000, desc: 'Plantilla profesional básica' }
            ]
        },
        'Marca De Agua': {
            icon: 'server',
            options: [
                { name: 'Con Marca', price: 0, desc: ' Tus clientes veran la Empresa CBO.com' },
                { name: 'Sin Marca', price: 500, desc: 'No aparecera la Empresa CBO.com' }
            ]
        },
        'Soporte': {
            icon: 'headset',
            options: [
                { name: 'Premium 24/7', price: 2500, desc: 'Soporte prioritario todo el día' },
                { name: 'Estándar 12/5', price: 1500, desc: 'Soporte de lunes a viernes' },
                { name: 'Básico', price: 500, desc: 'Soporte por Gmail' }
            ]
        }
    };

    // Estado de la aplicación
    const appState = {
        selectedOptions: {},
        formData: {
            name: '',
            phone: '',
            email: ''
        }
    };

    // Elementos del DOM
    const DOM = {
        optionsContainer: document.querySelector('.options-container'),
        selectedOptionsContainer: document.querySelector('.selected-options'),
        totalPriceElement: document.querySelector('.total-price'),
        clientForm: document.getElementById('client-form'),
        clientNameInput: document.getElementById('client-name'),
        clientPhoneInput: document.getElementById('client-phone'),
        clientEmailInput: document.getElementById('client-email'),
        whatsappBtn: document.getElementById('whatsapp-btn'),
        copyBtn: document.getElementById('copy-btn'),
        notification: document.getElementById('notification')
    };

    // Inicializar la aplicación
    function init() {
        renderOptions();
        setupEventListeners();
        loadFromLocalStorage();
    }

    // Renderizar las opciones del plan
    function renderOptions() {
        let html = '';
        
        for (const [category, data] of Object.entries(planOptions)) {
            html += `
                <div class="option-category">
                    <h3 class="category-title">
                        <i class="fas fa-${data.icon}" aria-hidden="true"></i> ${category}
                    </h3>
                    <div class="options-list">
                        ${data.options.map(option => `
                            <div class="option-item 
                                ${appState.selectedOptions[category]?.name === option.name ? 'selected' : ''}" 
                                data-category="${category}" 
                                data-name="${option.name}" 
                                data-price="${option.price}"
                                role="button"
                                tabindex="0"
                                aria-label="Seleccionar ${option.name} por $${option.price} CUP">
                                <div class="option-item-content">
                                    <div class="option-item-main">
                                        <h4 class="option-title">${option.name}</h4>
                                        <div class="option-price">$${option.price} CUP</div>
                                    </div>
                                    <p class="option-desc">${option.desc}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        DOM.optionsContainer.innerHTML = html;
        updateSummary();
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Selección de opciones
        DOM.optionsContainer.addEventListener('click', handleOptionSelection);
        DOM.optionsContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const option = e.target.closest('.option-item');
                if (option) {
                    e.preventDefault();
                    selectOption(option);
                }
            }
        });

        // Formulario
        DOM.clientForm.addEventListener('input', (e) => {
            const { id, value } = e.target;
            if (id in appState.formData) {
                appState.formData[id] = value;
                saveToLocalStorage();
            }
        });

        // Botones de acción
        DOM.whatsappBtn.addEventListener('click', () => sendViaWhatsApp('+5350369270'));
        DOM.copyBtn.addEventListener('click', copySummary);
    }

    // Manejar selección de opciones
    function handleOptionSelection(e) {
        const option = e.target.closest('.option-item');
        if (option) selectOption(option);
    }

    // Seleccionar una opción
    function selectOption(optionElement) {
        const category = optionElement.dataset.category;
        const name = optionElement.dataset.name;
        const price = parseInt(optionElement.dataset.price);
        
        // Deseleccionar otras opciones en la misma categoría
        document.querySelectorAll(`.option-item[data-category="${category}"]`).forEach(item => {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        });
        
        // Seleccionar la opción actual
        optionElement.classList.add('selected');
        optionElement.setAttribute('aria-selected', 'true');
        
        // Actualizar el estado
        appState.selectedOptions[category] = { name, price };
        
        // Actualizar la interfaz
        updateSummary();
        showNotification(`Seleccionado: ${category} - ${name}`, 'success');
        saveToLocalStorage();
    }

    // Actualizar el resumen
    function updateSummary() {
        let total = 0;
        let html = '';
        
        for (const [category, data] of Object.entries(planOptions)) {
            const selectedOption = appState.selectedOptions[category];
            const optionName = selectedOption?.name || 'No seleccionado';
            const optionPrice = selectedOption?.price || 0;
            
            total += optionPrice;
            
            if (optionPrice > 0) {
                html += `
                    <div class="selected-option">
                        <span class="option-name">${category}:</span>
                        <span class="option-cost">$${optionPrice} CUP</span>
                    </div>
                `;
            }
        }
        
        DOM.selectedOptionsContainer.innerHTML = html || '<p class="option-desc">No hay opciones seleccionadas</p>';
        DOM.totalPriceElement.textContent = `$${total} CUP`;
    }

    // Enviar por WhatsApp
    function sendViaWhatsApp(phoneNumber) {
        if (!validateForm()) return;
        
        const summary = generateSummary();
        const message = encodeURIComponent(summary);
        
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        trackAction('whatsapp_send');
    }

    // Copiar resumen
    function copySummary() {
        if (!validateForm(true)) return;
        
        const summary = generateSummary();
        
        navigator.clipboard.writeText(summary).then(() => {
            showNotification('Resumen copiado al portapapeles', 'success');
            trackAction('copy_summary');
        }).catch(err => {
            showNotification('Error al copiar el resumen', 'error');
            console.error('Error al copiar:', err);
        });
    }

    // Generar resumen del plan
    function generateSummary() {
        let summary = `*Resumen del Plan Web - CHP Solutions*\n\n`;
        summary += `*Datos del Cliente:*\n`;
        summary += `- Nombre: ${appState.formData.name}\n`;
        summary += `- Teléfono: ${appState.formData.phone}\n`;
        
        if (appState.formData.email) {
            summary += `- Correo: ${appState.formData.email}\n`;
        }
        
        summary += `\n*Opciones seleccionadas:*\n`;
        
        let total = 0;
        for (const [category, data] of Object.entries(planOptions)) {
            const selectedOption = appState.selectedOptions[category];
            const optionPrice = selectedOption?.price || 0;
            
            if (optionPrice > 0) {
                summary += `- ${category}: ${selectedOption.name} ($${optionPrice} CUP)\n`;
                total += optionPrice;
            }
        }
        
        summary += `\n*Total a pagar:* $${total} CUP\n\n`;
        summary += `*Instrucciones de pago:*\n`;
        summary += `1. Realiza el pago por Transfermóvil al número +5350369270\n`;
        summary += `2. Envía el comprobante por WhatsApp al mismo número\n`;
        summary += `3. Tu sitio web será activado en 24-48 horas\n\n`;
        summary += `_Fecha: ${new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}_`;
        
        return summary;
    }

    // Validar formulario
    function validateForm(skipPhoneCheck = false) {
        if (!appState.formData.name.trim()) {
            showNotification('Por favor ingresa tu nombre completo', 'error');
            DOM.clientNameInput.focus();
            return false;
        }
        
        if (!skipPhoneCheck && (!appState.formData.phone.trim() || !/^\d{8}$/.test(appState.formData.phone))) {
            showNotification('El teléfono debe tener 8 dígitos numéricos', 'error');
            DOM.clientPhoneInput.focus();
            return false;
        }
        
        if (Object.keys(appState.selectedOptions).length === 0) {
            showNotification('Por favor selecciona al menos una opción', 'error');
            return false;
        }
        
        return true;
    }

    // Mostrar notificación
    function showNotification(message, type = 'success') {
        const notification = DOM.notification;
        const content = notification.querySelector('.notification-content');
        
        notification.className = `notification ${type} show`;
        
        let icon;
        switch(type) {
            case 'success': icon = 'check-circle'; break;
            case 'error': icon = 'times-circle'; break;
            default: icon = 'info-circle';
        }
        
        content.innerHTML = `
            <i class="fas fa-${icon}" aria-hidden="true"></i>
            ${message}
        `;
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Guardar en localStorage
    function saveToLocalStorage() {
        localStorage.setItem('planConfigState', JSON.stringify(appState));
    }

    // Cargar desde localStorage
    function loadFromLocalStorage() {
        const savedState = localStorage.getItem('planConfigState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            
            // Actualizar estado manteniendo valores por defecto
            if (parsedState.selectedOptions) {
                appState.selectedOptions = parsedState.selectedOptions;
            }
            
            if (parsedState.formData) {
                appState.formData = {
                    ...appState.formData,
                    ...parsedState.formData
                };
            }
            
            // Restaurar valores del formulario
            DOM.clientNameInput.value = appState.formData.name || '';
            DOM.clientPhoneInput.value = appState.formData.phone || '';
            DOM.clientEmailInput.value = appState.formData.email || '';
            
            renderOptions();
        }
    }

    // Trackear acciones (para analytics)
    function trackAction(action) {
        console.log('Acción registrada:', action);
        // Aquí se podría integrar Google Analytics
    }

    // Iniciar la aplicación
    init();
});
document.addEventListener('DOMContentLoaded', function() {
    // Datos de configuración mejorados
    const planOptions = {
        'Interfaz': {
            icon: 'paint-brush',
            options: [
                { name: 'Básica', price: 100, desc: 'Diseño limpio y simple' },
                { name: 'Profesional', price: 200, desc: 'Diseño intuitivo con elementos personalizados' },
                { name: 'Tecnológico', price: 400, desc: 'Diseño 3D futurista y experiencia única' }
            ]
        },
        'Subdominio': {
            icon: 'globe',
            options: [
                { name: '.com', price: 150, desc: 'Subdominio estándar' },
            ]
        },
        'Soporte': {
            icon: 'headset',
            options: [
                { name: 'Gmail', price: 0, desc: 'Soporte por correo electrónico, respuesta en días' },
                { name: '12/7', price: 100, desc: 'Soporte por WhatsApp 12 horas, de lunes a viernes' },
                { name: '24/7', price: 200, desc: 'Soporte prioritario por WhatsApp 24/7' }
            ]
        },
        'Duración': {
            icon: 'calendar-alt',
            options: [
                { name: '7 Días', price: 50, desc: 'Prueba corta para evaluar el servicio' },
                { name: '15 Días', price: 100, desc: 'Para proyectos a corto plazo' },
                { name: '30 Días', price: 200, desc: 'Plan mensual estándar' },
                { name: '1 Año', price: 2000, desc: 'Ahorras más a largo plazo' }
            ]
        },
        'Marca de Agua': {
            icon: 'water',
            options: [
                { name: 'Sin Marca', price: 100, desc: 'Sin marca de agua de la empresa CBO' },
                { name: 'Marca Visible', price: 0, desc: 'Marca de agua visible de la empresa CBO' }
            ]
        },
        'Versión Móvil': {
            icon: 'mobile-screen',
            options: [
                { name: 'No Incluir', price: 0, desc: 'Solo versión web' },
                { name: 'Incluir', price: 250, desc: 'Versión móvil adaptativa' },
            ]
        },
        'Logotipo': {
            icon: 'image',
            options: [
                { name: 'No Incluido', price: 0, desc: 'No usarás logotipo' },
                { name: 'Diseño Básico', price: 250, desc: 'Logotipo simple pero profesional' },
                { name: 'Diseño Premium', price: 500, desc: 'Logotipo personalizado y único' }
            ]
        },
        'Actualizaciones': {
            icon: 'sync',
            options: [
                { name: 'Sin Actualizaciones', price: 0, desc: 'Sin cambios futuros' },
                { name: 'Actualizaciones Básicas', price: 200, desc: 'Una actualización o modificación al mes (cambios pequeños)' },
            ]
        },
        'Productos/Servicios': {
            icon: 'box',
            options: [
                { name: '1 Producto/Servicio', price: 0, desc: 'Para sitios con un solo producto o servicio' },
                { name: '5 Productos/Servicios', price: 100, desc: 'Hasta 5 productos o servicios' },
                { name: '10 Productos/Servicios', price: 250, desc: 'Hasta 10 productos o servicios' },
                { name: '25 Productos/Servicios', price: 500, desc: 'Hasta 25 productos o servicios' },
                { name: '50 Productos/Servicios', price: 1000, desc: 'Hasta 50 productos o servicios' }
            ]
        }
    };

    // Estado de la aplicación mejorado
    const appState = {
        compactView: true,
        selectedOptions: {},
        formData: {
            name: '',
            phone: '',
            email: '',
            affiliate: ''
        },
        collapsedCategories: []
    };

    // Elementos del DOM con mejor selección
    const domElements = {
        optionsContainer: document.querySelector('.options-container'),
        selectedOptionsContainer: document.querySelector('.selected-options'),
        totalPriceElement: document.querySelector('.total-price'),
        toggleViewBtn: document.getElementById('toggle-view'),
        resetOptionsBtn: document.getElementById('reset-options'),
        clientForm: document.getElementById('client-form'),
        whatsappBtn: document.getElementById('whatsapp-btn'),
        smsBtn: document.getElementById('sms-btn'),
        copyBtn: document.getElementById('copy-btn'),
        notification: document.getElementById('notification'),
        clientNameInput: document.getElementById('client-name'),
        clientPhoneInput: document.getElementById('client-phone'),
        clientEmailInput: document.getElementById('client-email'),
        affiliateInput: document.getElementById('affiliate')
    };

    // Inicializar la aplicación
    function init() {
        renderOptions();
        setupEventListeners();
        loadFromLocalStorage();
        setupAccessibility();
    }

    // Renderizar las opciones del plan con mejor estructura
    function renderOptions() {
        let html = '';
        
        for (const [category, data] of Object.entries(planOptions)) {
            const isCollapsed = appState.compactView && appState.collapsedCategories.includes(category);
            
            html += `
                <div class="option-category ${appState.compactView ? 'compact' : ''}">
                    <h3 class="category-title ${isCollapsed ? 'collapsed' : ''}" 
                        data-category="${category}"
                        aria-expanded="${!isCollapsed}"
                        aria-controls="options-${category.replace(/\s+/g, '-').toLowerCase()}">
                        <i class="fas fa-${data.icon}" aria-hidden="true"></i> ${category}
                    </h3>
                    <div id="options-${category.replace(/\s+/g, '-').toLowerCase()}" 
                         class="options-${appState.compactView ? 'list' : 'grid'}" 
                         ${isCollapsed ? 'hidden' : ''}>
                        ${data.options.map(option => `
                            <div class="option-${appState.compactView ? 'item' : 'card'} 
                                ${appState.selectedOptions[category]?.name === option.name ? 'selected' : ''}" 
                                data-category="${category}" 
                                data-name="${option.name}" 
                                data-price="${option.price}"
                                role="button"
                                tabindex="0"
                                aria-label="Seleccionar ${option.name} por $${option.price} CUP">
                                ${appState.compactView ? `
                                    <div class="option-item-content">
                                        <div class="option-item-main">
                                            <h4 class="option-title">${option.name}</h4>
                                            <div class="option-price">$${option.price} CUP</div>
                                        </div>
                                        <p class="option-desc">${option.desc}</p>
                                    </div>
                                ` : `
                                    <h4 class="option-title">${option.name}</h4>
                                    <div class="option-price">$${option.price} CUP</div>
                                    <p class="option-desc">${option.desc}</p>
                                `}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        domElements.optionsContainer.innerHTML = html;
        updateSelectedOptionsSummary();
    }

    // Configurar event listeners mejorados
    function setupEventListeners() {
        // Toggle vista compacta
        domElements.toggleViewBtn.addEventListener('click', toggleViewMode);
        domElements.toggleViewBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') toggleViewMode();
        });
        
        // Reiniciar opciones
        domElements.resetOptionsBtn.addEventListener('click', resetOptions);
        domElements.resetOptionsBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') resetOptions();
        });
        
        // Selección de opciones (delegación de eventos mejorada)
        domElements.optionsContainer.addEventListener('click', handleOptionSelection);
        domElements.optionsContainer.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                const optionElement = e.target.closest('.option-item, .option-card');
                if (optionElement) {
                    e.preventDefault();
                    selectOption(optionElement);
                }
            }
        });
        
        // Colapso de categorías
        domElements.optionsContainer.addEventListener('click', (e) => {
            const categoryTitle = e.target.closest('.category-title');
            if (categoryTitle) {
                toggleCategoryCollapse(categoryTitle);
            }
        });
        
        // Formulario de cliente
        domElements.clientForm.addEventListener('input', handleFormInput);
        
        // Botones de acción
        domElements.whatsappBtn.addEventListener('click', () => sendViaWhatsApp('+5350369270'));
        domElements.whatsappBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') sendViaWhatsApp('+5350369270');
        });
        
        domElements.smsBtn.addEventListener('click', () => sendViaSMS('+5350369270'));
        domElements.smsBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') sendViaSMS('+5350369270');
        });
        
        domElements.copyBtn.addEventListener('click', copySummary);
        domElements.copyBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') copySummary();
        });
    }

    // Configurar accesibilidad
    function setupAccessibility() {
        // Asegurar que los elementos interactivos sean accesibles por teclado
        document.querySelectorAll('.option-item, .option-card').forEach(item => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
        });
        
        // Mejorar el manejo de focus
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                // Asegurar que el focus sea visible
                document.documentElement.classList.add('keyboard-focus');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.documentElement.classList.remove('keyboard-focus');
        });
    }

    // Manejar selección de opciones
    function handleOptionSelection(e) {
        const optionElement = e.target.closest('.option-item, .option-card');
        if (optionElement) {
            selectOption(optionElement);
        }
    }

    // Manejar entrada del formulario
    function handleFormInput(e) {
        const { id, value } = e.target;
        if (id in appState.formData) {
            appState.formData[id] = value;
            saveToLocalStorage();
        }
    }

    // Alternar entre vista de listado y grid
    function toggleViewMode() {
        appState.compactView = !appState.compactView;
        domElements.toggleViewBtn.innerHTML = `
            <i class="fas fa-${appState.compactView ? 'th-large' : 'list'}" aria-hidden="true"></i> 
            ${appState.compactView ? 'Vista de Cuadrícula' : 'Vista de Listado'}
        `;
        domElements.toggleViewBtn.setAttribute('aria-label', 
            appState.compactView ? 'Cambiar a vista de cuadrícula' : 'Cambiar a vista de listado');
        renderOptions();
        saveToLocalStorage();
    }

    // Alternar colapso de categoría
    function toggleCategoryCollapse(categoryTitle) {
        if (!appState.compactView) return;
        
        const category = categoryTitle.getAttribute('data-category');
        const isCollapsed = categoryTitle.classList.contains('collapsed');
        
        if (isCollapsed) {
            // Abrir categoría
            categoryTitle.classList.remove('collapsed');
            const index = appState.collapsedCategories.indexOf(category);
            if (index > -1) {
                appState.collapsedCategories.splice(index, 1);
            }
            categoryTitle.setAttribute('aria-expanded', 'true');
            categoryTitle.nextElementSibling.hidden = false;
        } else {
            // Cerrar categoría
            categoryTitle.classList.add('collapsed');
            if (!appState.collapsedCategories.includes(category)) {
                appState.collapsedCategories.push(category);
            }
            categoryTitle.setAttribute('aria-expanded', 'false');
            categoryTitle.nextElementSibling.hidden = true;
        }
        
        saveToLocalStorage();
    }

    // Seleccionar una opción
    function selectOption(optionElement) {
        const category = optionElement.getAttribute('data-category');
        const name = optionElement.getAttribute('data-name');
        const price = parseInt(optionElement.getAttribute('data-price'));
        
        // Deseleccionar otras opciones en la misma categoría
        document.querySelectorAll(`.option-item[data-category="${category}"], .option-card[data-category="${category}"]`).forEach(item => {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        });
        
        // Seleccionar la opción actual
        optionElement.classList.add('selected');
        optionElement.setAttribute('aria-selected', 'true');
        
        // Actualizar el estado
        appState.selectedOptions[category] = { name, price };
        
        // Actualizar la interfaz y notificación
        updateSelectedOptionsSummary();
        showNotification(`Opción seleccionada: ${category} - ${name}`, 'success');
        saveToLocalStorage();
    }

    // Reiniciar todas las opciones
    function resetOptions() {
        appState.selectedOptions = {};
        renderOptions();
        showNotification('Opciones reiniciadas correctamente', 'success');
        saveToLocalStorage();
        
        // Restablecer atributos ARIA
        document.querySelectorAll('.option-item, .option-card').forEach(item => {
            item.setAttribute('aria-selected', 'false');
        });
    }

    // Actualizar el resumen de opciones seleccionadas
    function updateSelectedOptionsSummary() {
        let total = 0;
        let html = '';
        
        for (const [category, data] of Object.entries(planOptions)) {
            const selectedOption = appState.selectedOptions[category];
            const optionName = selectedOption?.name || 'No seleccionado';
            const optionPrice = selectedOption?.price || 0;
            
            total += optionPrice;
            
            html += `
                <div class="selected-option">
                    <span class="option-name">${category}:</span>
                    <span class="option-cost">${optionPrice > 0 ? `$${optionPrice} CUP` : '-'}</span>
                </div>
            `;
        }
        
        domElements.selectedOptionsContainer.innerHTML = html;
        domElements.totalPriceElement.textContent = `$${total} CUP`;
        domElements.totalPriceElement.setAttribute('aria-live', 'polite');
    }

    // Enviar por WhatsApp
    function sendViaWhatsApp(phoneNumber) {
        if (!validateForm()) return;
        
        const summary = generateSummary();
        const message = encodeURIComponent(summary);
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        showNotification('Resumen enviado al administrador por WhatsApp', 'success');
        trackAction('whatsapp_send');
    }

    // Enviar por SMS
    function sendViaSMS(phoneNumber) {
        if (!validateForm()) return;
        
        const summary = generateSummary();
        
        // Esto abrirá el cliente de SMS predeterminado en dispositivos móviles
        const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(summary)}`;
        window.location.href = smsUrl;
        
        showNotification('Resumen listo para enviar al administrador por SMS', 'success');
        trackAction('sms_send');
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

    // Generar resumen del plan mejorado
    function generateSummary() {
        let summary = `*Resumen del Plan Personalizado - Enviado al Administrador*\n\n`;
        summary += `*Datos del Cliente:*\n`;
        summary += `- Nombre: ${appState.formData.name}\n`;
        summary += `- Teléfono: ${appState.formData.phone}\n`;
        
        if (appState.formData.email) {
            summary += `- Correo: ${appState.formData.email}\n`;
        }
        
        if (appState.formData.affiliate) {
            summary += `- Afiliado: ${appState.formData.affiliate}\n`;
        }
        
        summary += `\n*Opciones seleccionadas:*\n`;
        
        let total = 0;
        for (const [category, data] of Object.entries(planOptions)) {
            const selectedOption = appState.selectedOptions[category];
            const optionName = selectedOption?.name || 'No seleccionado';
            const optionPrice = selectedOption?.price || 0;
            
            summary += `- ${category}: ${optionName} (${optionPrice > 0 ? `$${optionPrice} CUP` : 'Incluido'})\n`;
            total += optionPrice;
        }
        
        summary += `\n*Total a pagar:* $${total} CUP\n\n`;
        summary += `*Método de pago:* Transfermóvil\n`;
        summary += `*Número para pago:* +5350369270\n\n`;
        summary += `*Instrucciones:*\n`;
        summary += `1. Realiza el pago por Transfermóvil al número +5350369270\n`;
        summary += `2. Envía el comprobante de pago por WhatsApp al mismo número\n`;
        summary += `3. Tu servicio será activado en un plazo máximo de 24 horas\n\n`;
        summary += `_Este resumen fue generado automáticamente el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}._`;
        
        return summary;
    }

    // Validar formulario mejorado
    function validateForm(skipPhoneCheck = false) {
        if (!appState.formData.name.trim()) {
            showNotification('Por favor ingresa tu nombre completo', 'error');
            domElements.clientNameInput.focus();
            return false;
        }
        
        if (!skipPhoneCheck && !appState.formData.phone.trim()) {
            showNotification('Por favor ingresa tu número de teléfono', 'error');
            domElements.clientPhoneInput.focus();
            return false;
        }
        
        if (!skipPhoneCheck && !/^\d{8}$/.test(appState.formData.phone)) {
            showNotification('El teléfono debe tener 8 dígitos numéricos', 'error');
            domElements.clientPhoneInput.focus();
            return false;
        }
        
        if (Object.keys(appState.selectedOptions).length === 0) {
            showNotification('Por favor selecciona al menos una opción', 'error');
            return false;
        }
        
        return true;
    }

    // Mostrar notificación mejorada
    function showNotification(message, type = 'success') {
        const notification = domElements.notification;
        const content = notification.querySelector('.notification-content');
        
        // Configurar notificación
        notification.className = `notification ${type} show`;
        notification.setAttribute('aria-live', 'assertive');
        
        // Configurar icono según tipo
        let icon;
        switch(type) {
            case 'success': icon = 'check-circle'; break;
            case 'error': icon = 'times-circle'; break;
            case 'warning': icon = 'exclamation-circle'; break;
            default: icon = 'info-circle';
        }
        
        content.innerHTML = `
            <i class="fas fa-${icon}" aria-hidden="true"></i>
            ${message}
        `;
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Guardar en localStorage con manejo de errores
    function saveToLocalStorage() {
        try {
            localStorage.setItem('planCustomizerState', JSON.stringify(appState));
        } catch (e) {
            console.error('Error al guardar en localStorage:', e);
        }
    }

    // Cargar desde localStorage con manejo de errores
    function loadFromLocalStorage() {
        try {
            const savedState = localStorage.getItem('planCustomizerState');
            if (savedState) {
                const parsedState = JSON.parse(savedState);
                
                // Actualizar el estado manteniendo la estructura por defecto
                if (parsedState.compactView !== undefined) {
                    appState.compactView = parsedState.compactView;
                }
                
                if (parsedState.selectedOptions) {
                    appState.selectedOptions = parsedState.selectedOptions;
                }
                
                if (parsedState.formData) {
                    appState.formData = {
                        ...appState.formData,
                        ...parsedState.formData
                    };
                }
                
                if (parsedState.collapsedCategories) {
                    appState.collapsedCategories = parsedState.collapsedCategories;
                }
                
                // Restaurar formulario
                domElements.clientNameInput.value = appState.formData.name || '';
                domElements.clientPhoneInput.value = appState.formData.phone || '';
                domElements.clientEmailInput.value = appState.formData.email || '';
                domElements.affiliateInput.value = appState.formData.affiliate || '';
                
                // Actualizar UI
                domElements.toggleViewBtn.innerHTML = `
                    <i class="fas fa-${appState.compactView ? 'th-large' : 'list'}" aria-hidden="true"></i> 
                    ${appState.compactView ? 'Vista de Cuadrícula' : 'Vista de Listado'}
                `;
                
                renderOptions();
            }
        } catch (e) {
            console.error('Error al cargar desde localStorage:', e);
            localStorage.removeItem('planCustomizerState');
        }
    }

    // Trackear acciones (para posibles analytics)
    function trackAction(action) {
        console.log('Acción registrada:', action);
        // Aquí podrías integrar Google Analytics u otro servicio
    }

    // Iniciar la aplicación
    init();
});
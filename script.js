document.addEventListener('DOMContentLoaded', function() {
    // Datos de configuración completos
    const planOptions = {
        'Interfaz': {
            icon: 'paint-brush',
            options: [
                { name: 'Básica', price: 100, desc: 'Diseño limpio y simple' },
                { name: 'Profesional', price: 200, desc: 'Diseño intuitivo con elementos personalizados' },
                { name: 'Tecnologico', price: 400, desc: 'Diseño 3D futuristas y experiencia unica' }
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
                { name: 'Gmail', price: 0, desc: 'Soporte por correo electrónico, las respuestas pueden tardar dias' },
                { name: '12/7', price: 100, desc: 'Soporte por whatsapp 12 horas, de lunes a viernes' },
                { name: '24/7', price: 200, desc: 'Soporte prioritario por whatsapp 24 horas, todos los días' }
            ]
        },
        'Duración': {
            icon: 'calendar-alt',
            options: [
                { name: '7 Días', price: 50, desc: 'Prueba corta para evaluar el servicio' },
                { name: '15 Días', price: 100, desc: 'Para proyectos a corto plazo' },
                { name: '30 Días', price: 200, desc: 'Plan mensual estándar' },
                { name: '1 Año', price: 2000, desc: 'Ahorras mas a largo plazo' }
            ]
        },
        'Marca de Agua': {
            icon: 'water',
            options: [
                { name: 'Sin Marca', price: 100, desc: 'Sin marca de agua, de la empresa CBO en tu sitio' },
                { name: 'Marca Visible', price: 0, desc: 'Marca de agua visible, de la empresa CBO' }
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
                { name: 'Actualizaciones Básicas', price: 200, desc: 'Una actualizacion o modificacion al mes, (solo cambios pequeños)' },
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

    // Estado de la aplicación
    let appState = {
        compactView: true,
        selectedOptions: {},
        formData: {
            name: '',
            phone: '',
            affiliate: ''
        }
    };

    // Elementos del DOM
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
                <div class="option-category ${appState.compactView ? 'compact' : ''}">
                    <h3 class="category-title ${appState.compactView ? 'collapsed' : ''}">
                        <i class="fas fa-${data.icon}"></i> ${category}
                    </h3>
                    <div class="options-${appState.compactView ? 'list' : 'grid'}">
                        ${data.options.map(option => `
                            <div class="option-${appState.compactView ? 'item' : 'card'} 
                                ${appState.selectedOptions[category]?.name === option.name ? 'selected' : ''}" 
                                data-category="${category}" 
                                data-name="${option.name}" 
                                data-price="${option.price}">
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

    // Configurar event listeners
    function setupEventListeners() {
        // Toggle vista compacta
        domElements.toggleViewBtn.addEventListener('click', toggleViewMode);
        
        // Reiniciar opciones
        domElements.resetOptionsBtn.addEventListener('click', resetOptions);
        
        // Selección de opciones (delegación de eventos)
        domElements.optionsContainer.addEventListener('click', function(e) {
            const optionElement = e.target.closest('.option-item, .option-card');
            if (optionElement) {
                selectOption(optionElement);
            }
            
            const categoryTitle = e.target.closest('.category-title');
            if (categoryTitle) {
                toggleCategoryCollapse(categoryTitle);
            }
        });
        
        // Formulario de cliente
        domElements.clientForm.addEventListener('input', function(e) {
            if (e.target.id === 'client-name') {
                appState.formData.name = e.target.value;
            } else if (e.target.id === 'client-phone') {
                appState.formData.phone = e.target.value;
            } else if (e.target.id === 'affiliate') {
                appState.formData.affiliate = e.target.value;
            }
            saveToLocalStorage();
        });
        
        // Botones de acción
        domElements.whatsappBtn.addEventListener('click', () => sendViaWhatsApp('+5350369270'));
        domElements.smsBtn.addEventListener('click', () => sendViaSMS('+5350369270'));
        domElements.copyBtn.addEventListener('click', copySummary);
    }

    // Alternar entre vista de listado y grid
    function toggleViewMode() {
        appState.compactView = !appState.compactView;
        domElements.toggleViewBtn.innerHTML = `
            <i class="fas fa-${appState.compactView ? 'th-large' : 'list'}"></i> 
            ${appState.compactView ? 'Vista de Cuadrícula' : 'Vista de Listado'}
        `;
        renderOptions();
        saveToLocalStorage();
    }

    // Alternar colapso de categoría
    function toggleCategoryCollapse(categoryTitle) {
        if (!appState.compactView) return;
        
        categoryTitle.classList.toggle('collapsed');
        const optionsContainer = categoryTitle.nextElementSibling;
        if (categoryTitle.classList.contains('collapsed')) {
            optionsContainer.style.display = 'none';
        } else {
            optionsContainer.style.display = appState.compactView ? 'flex' : 'grid';
        }
    }

    // Seleccionar una opción
    function selectOption(optionElement) {
        const category = optionElement.getAttribute('data-category');
        const name = optionElement.getAttribute('data-name');
        const price = parseInt(optionElement.getAttribute('data-price'));
        
        // Deseleccionar otras opciones en la misma categoría
        document.querySelectorAll(`.option-item[data-category="${category}"], .option-card[data-category="${category}"]`).forEach(item => {
            item.classList.remove('selected');
        });
        
        // Seleccionar la opción actual
        optionElement.classList.add('selected');
        
        // Actualizar el estado
        appState.selectedOptions[category] = { name, price };
        
        // Actualizar la interfaz
        updateSelectedOptionsSummary();
        saveToLocalStorage();
    }

    // Reiniciar todas las opciones
    function resetOptions() {
        appState.selectedOptions = {};
        renderOptions();
        showNotification('Opciones reiniciadas correctamente', 'success');
        saveToLocalStorage();
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
    }

    // Enviar por WhatsApp
    function sendViaWhatsApp(phoneNumber) {
        if (!validateForm()) return;
        
        const summary = generateSummary();
        const message = encodeURIComponent(summary);
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
        window.open(whatsappUrl, '_blank');
        
        showNotification('Resumen enviado al administrador por WhatsApp', 'success');
    }

    // Enviar por SMS
    function sendViaSMS(phoneNumber) {
        if (!validateForm()) return;
        
        const summary = generateSummary();
        
        // Esto abrirá el cliente de SMS predeterminado en dispositivos móviles
        const smsUrl = `sms:${phoneNumber}?body=${encodeURIComponent(summary)}`;
        window.location.href = smsUrl;
        
        showNotification('Resumen listo para enviar al administrador por SMS', 'success');
    }

    // Copiar resumen
    function copySummary() {
        if (!validateForm(true)) return;
        
        const summary = generateSummary();
        
        navigator.clipboard.writeText(summary).then(() => {
            showNotification('Resumen copiado al portapapeles', 'success');
        }).catch(err => {
            showNotification('Error al copiar el resumen', 'error');
            console.error('Error al copiar:', err);
        });
    }

    // Generar resumen del plan
    function generateSummary() {
        let summary = `*Resumen del Plan Personalizado - Enviado al Administrador*\n\n`;
        summary += `*Datos del Cliente:*\n`;
        summary += `- Nombre: ${appState.formData.name}\n`;
        summary += `- Teléfono: ${appState.formData.phone}\n`;
        
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
        summary += `_Este es un resumen generado automáticamente. Para cualquier duda, contacta al administrador._`;
        
        return summary;
    }

    // Validar formulario
    function validateForm(skipPhoneCheck = false) {
        if (!appState.formData.name.trim()) {
            showNotification('Por favor ingresa tu nombre completo', 'error');
            document.getElementById('client-name').focus();
            return false;
        }
        
        if (!skipPhoneCheck && !appState.formData.phone.trim()) {
            showNotification('Por favor ingresa tu número de teléfono', 'error');
            document.getElementById('client-phone').focus();
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
        const notification = domElements.notification;
        const content = notification.querySelector('.notification-content');
        
        notification.className = `notification ${type} show`;
        content.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'times-circle' : 'exclamation-circle'}"></i>
            ${message}
        `;
        
        // Ocultar después de 5 segundos
        setTimeout(() => {
            notification.classList.remove('show');
        }, 5000);
    }

    // Guardar en localStorage
    function saveToLocalStorage() {
        localStorage.setItem('planCustomizerState', JSON.stringify(appState));
    }

    // Cargar desde localStorage
    function loadFromLocalStorage() {
        const savedState = localStorage.getItem('planCustomizerState');
        if (savedState) {
            appState = JSON.parse(savedState);
            
            // Restaurar formulario
            if (appState.formData) {
                document.getElementById('client-name').value = appState.formData.name || '';
                document.getElementById('client-phone').value = appState.formData.phone || '';
                document.getElementById('affiliate').value = appState.formData.affiliate || '';
            }
            
            // Actualizar UI
            domElements.toggleViewBtn.innerHTML = `
                <i class="fas fa-${appState.compactView ? 'th-large' : 'list'}"></i> 
                ${appState.compactView ? 'Vista de Cuadrícula' : 'Vista de Listado'}
            `;
            
            renderOptions();
        }
    }

    // Iniciar la aplicación
    init();
});
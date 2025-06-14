class PlanConfigurator {
    constructor() {
        this.planOptions = {
            'Interfaz': { icon: 'paint-brush', options: [
                { name: 'Básica', price: 100, desc: 'Diseño limpio y simple' },
                { name: 'Profesional', price: 200, desc: 'Diseño intuitivo con elementos personalizados' },
                { name: 'Tecnologico', price: 400, desc: 'Diseño 3D futuristas y experiencia unica' }
            ]},
            'Subdominio': { icon: 'globe', options: [
                { name: '.com', price: 150, desc: 'Subdominio estándar' }
            ]},
            'Soporte': { icon: 'headset', options: [
                { name: 'Gmail', price: 0, desc: 'Soporte por correo electrónico' },
                { name: '12/7', price: 100, desc: 'Soporte por whatsapp 12 horas' },
                { name: '24/7', price: 200, desc: 'Soporte prioritario por whatsapp 24 horas' }
            ]},
            'Duración': { icon: 'calendar-alt', options: [
                { name: '7 Días', price: 50, desc: 'Prueba corta para evaluar el servicio' },
                { name: '15 Días', price: 100, desc: 'Para proyectos a corto plazo' },
                { name: '30 Días', price: 200, desc: 'Plan mensual estándar' },
                { name: '1 Año', price: 2000, desc: 'Ahorras mas a largo plazo' }
            ]},
            'Marca de Agua': { icon: 'water', options: [
                { name: 'Sin Marca', price: 100, desc: 'Sin marca de agua' },
                { name: 'Marca Visible', price: 0, desc: 'Marca de agua visible' }
            ]},
            'Versión Móvil': { icon: 'mobile-screen', options: [
                { name: 'No Incluir', price: 0, desc: 'Solo versión web' },
                { name: 'Incluir', price: 250, desc: 'Versión móvil adaptativa' }
            ]},
            'Logotipo': { icon: 'image', options: [
                { name: 'No Incluido', price: 0, desc: 'No usarás logotipo' },
                { name: 'Diseño Básico', price: 250, desc: 'Logotipo simple pero profesional' },
                { name: 'Diseño Premium', price: 500, desc: 'Logotipo personalizado y único' }
            ]},
            'Actualizaciones': { icon: 'sync', options: [
                { name: 'Sin Actualizaciones', price: 0, desc: 'Sin cambios futuros' },
                { name: 'Actualizaciones Básicas', price: 200, desc: 'Una actualización al mes' }
            ]},
            'Productos/Servicios': { icon: 'box', options: [
                { name: '1 Producto/Servicio', price: 0, desc: 'Para sitios con un solo producto' },
                { name: '5 Productos/Servicios', price: 100, desc: 'Hasta 5 productos o servicios' },
                { name: '10 Productos/Servicios', price: 250, desc: 'Hasta 10 productos o servicios' },
                { name: '25 Productos/Servicios', price: 500, desc: 'Hasta 25 productos o servicios' },
                { name: '50 Productos/Servicios', price: 1000, desc: 'Hasta 50 productos o servicios' }
            ]}
        };

        this.state = {
            compactView: true,
            selectedOptions: {},
            formData: { name: '', phone: '', email: '', affiliate: '' }
        };

        this.cacheDOM();
        this.init();
    }

    cacheDOM() {
        this.dom = {
            optionsContainer: document.getElementById('options-container'),
            selectedOptions: document.getElementById('selected-options'),
            totalPrice: document.getElementById('total-price'),
            toggleViewBtn: document.getElementById('toggle-view'),
            resetOptionsBtn: document.getElementById('reset-options'),
            clientForm: document.getElementById('client-form'),
            whatsappBtn: document.getElementById('whatsapp-btn'),
            smsBtn: document.getElementById('sms-btn'),
            copyBtn: document.getElementById('copy-btn'),
            notification: document.getElementById('notification')
        };
    }

    init() {
        this.loadState();
        this.renderOptions();
        this.bindEvents();
    }

    bindEvents() {
        this.dom.toggleViewBtn.addEventListener('click', () => this.toggleView());
        this.dom.resetOptionsBtn.addEventListener('click', () => this.resetOptions());
        
        this.dom.optionsContainer.addEventListener('click', (e) => {
            const option = e.target.closest('.option-item, .option-card');
            if (option) this.selectOption(option);
            
            const category = e.target.closest('.category-title');
            if (category) this.toggleCategory(category);
        });
        
        this.dom.clientForm.addEventListener('input', (e) => {
            const { id, value } = e.target;
            if (id in this.state.formData) {
                this.state.formData[id.replace('client-', '')] = value;
                this.saveState();
            }
        });
        
        this.dom.whatsappBtn.addEventListener('click', () => this.sendSummary('whatsapp'));
        this.dom.smsBtn.addEventListener('click', () => this.sendSummary('sms'));
        this.dom.copyBtn.addEventListener('click', () => this.copySummary());
    }

    toggleView() {
        this.state.compactView = !this.state.compactView;
        this.dom.toggleViewBtn.innerHTML = `
            <i class="fas fa-${this.state.compactView ? 'th-large' : 'list'}"></i> 
            ${this.state.compactView ? 'Vista de Cuadrícula' : 'Vista de Listado'}
        `;
        this.renderOptions();
        this.saveState();
    }

    toggleCategory(categoryTitle) {
        if (!this.state.compactView) return;
        categoryTitle.classList.toggle('collapsed');
        const options = categoryTitle.nextElementSibling;
        options.style.display = categoryTitle.classList.contains('collapsed') ? 'none' : 'flex';
    }

    selectOption(optionElement) {
        const category = optionElement.dataset.category;
        const { name, price } = optionElement.dataset;
        
        // Deselect all in category
        document.querySelectorAll(`[data-category="${category}"]`).forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select current
        optionElement.classList.add('selected');
        this.state.selectedOptions[category] = { name, price: parseInt(price) };
        this.updateSummary();
        this.saveState();
    }

    resetOptions() {
        this.state.selectedOptions = {};
        this.renderOptions();
        this.showNotification('Opciones reiniciadas correctamente', 'success');
        this.saveState();
    }

    renderOptions() {
        let html = '';
        
        for (const [category, data] of Object.entries(this.planOptions)) {
            const isSelected = category in this.state.selectedOptions;
            const viewType = this.state.compactView ? 'list' : 'grid';
            
            html += `
                <div class="option-category ${this.state.compactView ? 'compact' : ''}">
                    <h3 class="category-title ${this.state.compactView ? 'collapsed' : ''}">
                        <i class="fas fa-${data.icon}"></i> ${category}
                    </h3>
                    <div class="options-${viewType}">
                        ${data.options.map(opt => `
                            <div class="option-${this.state.compactView ? 'item' : 'card'} 
                                ${isSelected && this.state.selectedOptions[category].name === opt.name ? 'selected' : ''}" 
                                data-category="${category}" 
                                data-name="${opt.name}" 
                                data-price="${opt.price}">
                                ${this.state.compactView ? `
                                    <div class="option-item-content">
                                        <div class="option-item-main">
                                            <h4 class="option-title">${opt.name}</h4>
                                            <div class="option-price">$${opt.price} CUP</div>
                                        </div>
                                        <p class="option-desc">${opt.desc}</p>
                                    </div>
                                ` : `
                                    <h4 class="option-title">${opt.name}</h4>
                                    <div class="option-price">$${opt.price} CUP</div>
                                    <p class="option-desc">${opt.desc}</p>
                                `}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        this.dom.optionsContainer.innerHTML = html;
        this.updateSummary();
    }

    updateSummary() {
        let total = 0;
        let html = '';
        
        for (const [category] of Object.entries(this.planOptions)) {
            const selected = this.state.selectedOptions[category];
            const price = selected?.price || 0;
            
            total += price;
            html += `
                <div class="selected-option">
                    <span class="option-name">${category}:</span>
                    <span class="option-cost">${price > 0 ? `$${price} CUP` : '-'}</span>
                </div>
            `;
        }
        
        this.dom.selectedOptions.innerHTML = html;
        this.dom.totalPrice.textContent = `$${total} CUP`;
    }

    sendSummary(method) {
        if (!this.validateForm()) return;
        
        const summary = this.generateSummary();
        const phone = '+5350369270';
        
        if (method === 'whatsapp') {
            window.open(`https://wa.me/${phone}?text=${encodeURIComponent(summary)}`, '_blank');
            this.showNotification('Resumen enviado al administrador por WhatsApp', 'success');
        } else if (method === 'sms') {
            window.location.href = `sms:${phone}?body=${encodeURIComponent(summary)}`;
            this.showNotification('Resumen listo para enviar por SMS', 'success');
        }
    }

    copySummary() {
        if (!this.validateForm(true)) return;
        
        navigator.clipboard.writeText(this.generateSummary()).then(() => {
            this.showNotification('Resumen copiado al portapapeles', 'success');
        }).catch(err => {
            console.error('Error al copiar:', err);
            this.showNotification('Error al copiar el resumen', 'error');
        });
    }

    generateSummary() {
        let total = 0;
        let optionsSummary = '';
        
        for (const [category, data] of Object.entries(this.planOptions)) {
            const selected = this.state.selectedOptions[category];
            const price = selected?.price || 0;
            
            optionsSummary += `- ${category}: ${selected?.name || 'No seleccionado'} (${price > 0 ? `$${price} CUP` : 'Incluido'})\n`;
            total += price;
        }
        
        return `*Resumen del Plan Personalizado*\n\n*Datos del Cliente:*\n- Nombre: ${this.state.formData.name}\n- Teléfono: ${this.state.formData.phone}\n${
            this.state.formData.affiliate ? `- Afiliado: ${this.state.formData.affiliate}\n` : ''
        }\n*Opciones seleccionadas:*\n${optionsSummary}\n*Total a pagar:* $${total} CUP\n\n*Método de pago:* Transfermóvil\n*Número para pago:* +5350369270`;
    }

    validateForm(skipPhone = false) {
        if (!this.state.formData.name.trim()) {
            this.showNotification('Por favor ingresa tu nombre completo', 'error');
            document.getElementById('client-name').focus();
            return false;
        }
        
        if (!skipPhone && !this.state.formData.phone.trim()) {
            this.showNotification('Por favor ingresa tu número de teléfono', 'error');
            document.getElementById('client-phone').focus();
            return false;
        }
        
        if (Object.keys(this.state.selectedOptions).length === 0) {
            this.showNotification('Por favor selecciona al menos una opción', 'error');
            return false;
        }
        
        return true;
    }

    showNotification(message, type = 'success') {
        const icon = {
            success: 'check-circle',
            error: 'times-circle',
            warning: 'exclamation-circle'
        }[type];
        
        this.dom.notification.className = `notification ${type} show`;
        this.dom.notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i> ${message}
            </div>
        `;
        
        setTimeout(() => {
            this.dom.notification.classList.remove('show');
        }, 5000);
    }

    saveState() {
        localStorage.setItem('planConfigState', JSON.stringify(this.state));
    }

    loadState() {
        const saved = localStorage.getItem('planConfigState');
        if (saved) {
            this.state = JSON.parse(saved);
            
            // Restore form
            for (const [key, value] of Object.entries(this.state.formData)) {
                const el = document.getElementById(`client-${key}`);
                if (el) el.value = value || '';
            }
            
            // Update UI
            this.dom.toggleViewBtn.innerHTML = `
                <i class="fas fa-${this.state.compactView ? 'th-large' : 'list'}"></i> 
                ${this.state.compactView ? 'Vista de Cuadrícula' : 'Vista de Listado'}
            `;
        }
    }
}

// Inicialización optimizada
document.addEventListener('DOMContentLoaded', () => {
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => new PlanConfigurator());
    } else {
        setTimeout(() => new PlanConfigurator(), 0);
    }
});
// Simulador de crédito hipotecario
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const simulationModal = document.getElementById('simulation-modal');
    const simulateBtn = document.getElementById('simulate-btn');
    const closeModalBtn = document.querySelector('.close-modal');
    const amountSlider = document.getElementById('sim-amount');
    const termSlider = document.getElementById('sim-term');
    const rateSlider = document.getElementById('sim-rate');
    const amountValue = document.getElementById('amount-value');
    const termValue = document.getElementById('term-value');
    const rateValue = document.getElementById('rate-value');
    const monthlyPayment = document.getElementById('monthly-payment');
    const totalInterest = document.getElementById('total-interest');
    const totalPayment = document.getElementById('total-payment');
    const saveBtn = document.getElementById('save-simulation');
    const requestBtn = document.getElementById('request-credit');
    
    // Valores iniciales
    let loanAmount = 200000;
    let loanTerm = 20; // en años
    let interestRate = 8.55; // porcentaje anual

    // Función para abrir el modal
    function openModal() {
        if (simulationModal) {
            simulationModal.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Bloquear scroll de fondo
            calculateMortgage();
        }
    }
    
    // Función para cerrar el modal
    function closeModal() {
        if (simulationModal) {
            simulationModal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restaurar scroll
        }
    }

    // Event listeners
    // Abrir modal
    if (simulateBtn) {
        simulateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Botón simular clickeado'); // Debug
            openModal();
        });
    } else {
        console.error('No se encontró el botón simulate-btn');
    }

    // Cerrar modal con X
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            console.log('Botón cerrar clickeado'); // Debug
            closeModal();
        });
    }

    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', function(e) {
        if (e.target === simulationModal) {
            closeModal();
        }
    });

    // Cerrar con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && simulationModal.style.display === 'flex') {
            closeModal();
        }
    });

    // Actualizar valores de los sliders
    if (amountSlider) {
        amountSlider.addEventListener('input', function() {
            loanAmount = parseInt(this.value);
            amountValue.textContent = formatCurrency(loanAmount);
            calculateMortgage();
        });
    }

    if (termSlider) {
        termSlider.addEventListener('input', function() {
            loanTerm = parseInt(this.value);
            termValue.textContent = `${loanTerm} años`;
            calculateMortgage();
        });
    }

    if (rateSlider) {
        rateSlider.addEventListener('input', function() {
            interestRate = parseFloat(this.value);
            rateValue.textContent = `${interestRate.toFixed(2)}%`;
            calculateMortgage();
        });
    }

    // Guardar simulación
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            alert('Simulación guardada. Te enviaremos un correo con los detalles.');
            closeModal();
        });
    }

    // Solicitar crédito
    if (requestBtn) {
        requestBtn.addEventListener('click', function() {
            window.location.href = `requestcredit.html?type=vivienda&amount=${loanAmount}&term=${loanTerm}&rate=${interestRate}`;
        });
    }

    // Función para calcular la hipoteca
    function calculateMortgage() {
        try {
            // Convertir tasa anual a mensual
            const monthlyRate = (interestRate / 100) / 12;
            const seguroDesgravamen = 0.015; // 1.5%
            
            // Calcular número de pagos
            const payments = loanTerm * 12;
            
            // Calcular cuota mensual (fórmula de amortización)
            const x = Math.pow(1 + monthlyRate, payments);
            let monthly = (loanAmount * monthlyRate * x) / (x - 1);
            
            // Agregar seguro de desgravamen
            monthly = monthly * (1 + seguroDesgravamen);
            
            // Calcular totales
            const total = monthly * payments;
            const interest = total - loanAmount;
            
            // Actualizar UI
            if (monthlyPayment) monthlyPayment.textContent = formatCurrency(monthly);
            if (totalInterest) totalInterest.textContent = formatCurrency(interest);
            if (totalPayment) totalPayment.textContent = formatCurrency(total);
            
        } catch (error) {
            console.error('Error al calcular hipoteca:', error);
        }
    }

    // Formatear moneda
    function formatCurrency(amount) {
        if (isNaN(amount) || amount === null || amount === undefined) {
            return 'S/ 0.00';
        }
        
        return `S/ ${amount.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Inicializar valores al cargar
    function initializeValues() {
        if (amountValue) amountValue.textContent = formatCurrency(loanAmount);
        if (termValue) termValue.textContent = `${loanTerm} años`;
        if (rateValue) rateValue.textContent = `${interestRate.toFixed(2)}%`;
        
        // Establecer valores iniciales de los sliders
        if (amountSlider) amountSlider.value = loanAmount;
        if (termSlider) termSlider.value = loanTerm;
        if (rateSlider) rateSlider.value = interestRate;
        
        calculateMortgage();
    }

    // Inicializar al cargar
    initializeValues();

    // Debug: Verificar que todos los elementos existen
    console.log('Elementos encontrados:', {
        simulationModal: !!simulationModal,
        simulateBtn: !!simulateBtn,
        closeModalBtn: !!closeModalBtn,
        amountSlider: !!amountSlider,
        termSlider: !!termSlider,
        rateSlider: !!rateSlider
    });
});
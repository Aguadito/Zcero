// Simulador de crédito personal
document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const simulationModal = document.getElementById('simulation-modal');
    const simulateBtn = document.getElementById('simulate-btn');
    const closeModal = document.querySelector('.close-modal');
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
    let loanAmount = 10000;
    let loanTerm = 24; // en meses
    let interestRate = 10.5; // porcentaje anual

    // Abrir modal
    if (simulateBtn) {
        simulateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            simulationModal.style.display = 'flex';
            calculateLoan();
        });
    }

    // Cerrar modal
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            simulationModal.style.display = 'none';
        });
    }

    // Cerrar al hacer clic fuera del modal
    window.addEventListener('click', function(e) {
        if (e.target === simulationModal) {
            simulationModal.style.display = 'none';
        }
    });

    // Actualizar valores de los sliders
    amountSlider.addEventListener('input', function() {
        loanAmount = parseInt(this.value);
        amountValue.textContent = formatCurrency(loanAmount);
        calculateLoan();
    });

    termSlider.addEventListener('input', function() {
        loanTerm = parseInt(this.value);
        termValue.textContent = `${loanTerm} meses`;
        calculateLoan();
    });

    rateSlider.addEventListener('input', function() {
        interestRate = parseFloat(this.value);
        rateValue.textContent = `${interestRate.toFixed(2)}%`;
        calculateLoan();
    });

    // Guardar simulación
    saveBtn.addEventListener('click', function() {
        alert('Simulación guardada. Te enviaremos un correo con los detalles.');
        simulationModal.style.display = 'none';
    });

    // Solicitar crédito
    requestBtn.addEventListener('click', function() {
        window.location.href = `requestcredit.html?type=personal&amount=${loanAmount}&term=${loanTerm}&rate=${interestRate}`;
    });

    // Función para calcular el préstamo
    function calculateLoan() {
        // Convertir tasa anual a mensual
        const monthlyRate = (interestRate / 100) / 12;
        
        // Calcular cuota mensual (fórmula de amortización francesa)
        const x = Math.pow(1 + monthlyRate, loanTerm);
        const monthly = (loanAmount * monthlyRate * x) / (x - 1);
        
        // Calcular totales
        const total = monthly * loanTerm;
        const interest = total - loanAmount;
        
        // Actualizar UI
        monthlyPayment.textContent = formatCurrency(monthly);
        totalInterest.textContent = formatCurrency(interest);
        totalPayment.textContent = formatCurrency(total);
    }

    // Formatear moneda
    function formatCurrency(amount) {
            return `S/ ${amount.toLocaleString('es-PE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    }

    // Calcular al cargar
    calculateLoan();
});
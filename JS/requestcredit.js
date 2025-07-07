// Funciones para mostrar/ocultar formularios
function showForm(type) {
    hideForm();
    const form = document.getElementById(`form-${type}`);
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
        attachValidationListeners(type);
    }
}

function hideForm() {
    const forms = document.querySelectorAll('.credit-form');
    forms.forEach(form => {
        form.style.display = 'none';
    });
}

// Funciones para navegación de pasos
function nextStep(step) {
    if (step === 2) {
        if (!validateStep1('vivienda')) return;
    }
    updateFormStep('vivienda', step);
    updateSummary('vivienda');
}

function prevStep(step) {
    updateFormStep('vivienda', step);
}

function nextStepPersonal(step) {
    if (step === 2) {
        if (!validateStep1('personal')) return;
    }
    updateFormStep('personal', step);
    updateSummary('personal');
}

function prevStepPersonal(step) {
    updateFormStep('personal', step);
}

// Función para actualizar pasos del formulario
function updateFormStep(formType, step) {
    const form = document.getElementById(`form-${formType}`);
    const steps = form.querySelectorAll('.form-step');
    const progressSteps = form.querySelectorAll('.progress-step');

    // Ocultar todos los pasos
    steps.forEach(s => s.classList.remove('active'));
    progressSteps.forEach(p => p.classList.remove('active'));

    // Mostrar paso actual
    const currentStep = form.querySelector(`.form-step[data-step="${step}"]`);
    const currentProgress = form.querySelector(`.progress-step[data-step="${step}"]`);

    if (currentStep) currentStep.classList.add('active');
    if (currentProgress) currentProgress.classList.add('active');

    // Marcar pasos anteriores como completados
    progressSteps.forEach(p => {
        const stepNum = parseInt(p.dataset.step);
        if (stepNum < step) {
            p.classList.add('completed');
        } else if (stepNum > step) {
            p.classList.remove('completed');
        }
    });
}

// Función para actualizar resumen
function updateSummary(formType) {
    const prefix = formType === 'vivienda' ? 'v' : 'p';
    const monto = document.getElementById(`monto-${prefix}`).value;
    const plazo = document.getElementById(`plazo-${prefix}`).value;

    document.getElementById(`summary-monto-${prefix}`).textContent = `S/ ${monto}`;

    if (formType === 'vivienda') {
        document.getElementById(`summary-plazo-${prefix}`).textContent = `${plazo} años`;
    } else {
        document.getElementById(`summary-plazo-${prefix}`).textContent = `${plazo} meses`;
    }
}

// Validación del paso 1
function validateStep1(formType) {
    const prefix = formType === 'vivienda' ? 'v' : 'p';
    const fields = [
        { id: `nombre-${prefix}`, name: 'nombre completo' },
        { id: `dni-${prefix}`, name: 'DNI', pattern: /^\d{8}$/ },
        { id: `email-${prefix}`, name: 'correo electrónico', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        { id: `telefono-${prefix}`, name: 'teléfono', pattern: /^\d{9}$/ }
    ];

    let isValid = true;
    clearErrorMessages(formType);

    for (const field of fields) {
        const input = document.getElementById(field.id);
        const value = input.value.trim();

        if (!value) {
            showFieldError(input, `El campo ${field.name} es obligatorio`);
            isValid = false;
            continue;
        }

        if (field.pattern && !field.pattern.test(value)) {
            if (field.id.includes('dni')) {
                showFieldError(input, 'El DNI debe tener 8 dígitos numéricos');
            } else if (field.id.includes('email')) {
                showFieldError(input, 'Ingrese un correo electrónico válido');
            } else if (field.id.includes('telefono')) {
                showFieldError(input, 'El teléfono debe tener 9 dígitos');
            }
            isValid = false;
        }
    }

    if (!isValid) {
        showValidationMessage('Por favor, corrija los errores en el formulario');
    }

    return isValid;
}

// Mostrar mensaje de error para un campo específico
function showFieldError(input, message) {
    input.classList.add('invalid');

    let errorElement = input.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        input.parentNode.insertBefore(errorElement, input.nextSibling);
    }

    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Limpiar mensajes de error
function clearErrorMessages(formType) {
    const prefix = formType === 'vivienda' ? 'v' : 'p';
    const fields = [`nombre-${prefix}`, `dni-${prefix}`, `email-${prefix}`, `telefono-${prefix}`];

    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.classList.remove('invalid');
            const errorElement = input.nextElementSibling;
            if (errorElement && errorElement.classList.contains('error-message')) {
                errorElement.style.display = 'none';
            }
        }
    });
}

// Mostrar mensaje de validación global
function showValidationMessage(message) {
    const container = document.getElementById('validation-messages');
    const errorText = document.getElementById('error-text');

    errorText.textContent = message;
    container.style.display = 'block';

    setTimeout(() => {
        container.style.display = 'none';
    }, 5000);
}

// Mostrar mensaje de confirmación
function showConfirmation() {
    const overlay = document.getElementById('confirmation-overlay');
    overlay.style.display = 'flex';

    setTimeout(() => {
        overlay.style.display = 'none';
    }, 5000);
}

// Limpiar formulario
function clearForm(formType) {
    const prefix = formType === 'vivienda' ? 'v' : 'p';
    const fields = [
        `nombre-${prefix}`, `dni-${prefix}`, `email-${prefix}`, `telefono-${prefix}`,
        `monto-${prefix}`, `plazo-${prefix}`, `ingresos-${prefix}`, `trabajo-${prefix}`, `finalidad-${prefix}`
    ];

    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) input.value = '';
    });

    const termsCheckbox = document.getElementById(`terms-${prefix}`);
    if (termsCheckbox) termsCheckbox.checked = false;

    updateFormStep(formType, 1);
}

// Adjuntar listeners de validación a los campos
function attachValidationListeners(formType) {
    const prefix = formType === 'vivienda' ? 'v' : 'p';
    const fields = [`nombre-${prefix}`, `dni-${prefix}`, `email-${prefix}`, `telefono-${prefix}`];

    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
            input.addEventListener('input', function() {
                this.classList.remove('invalid');
                const errorElement = this.nextElementSibling;
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.style.display = 'none';
                }
            });
        }
    });
}

// Event listeners globales
document.addEventListener('DOMContentLoaded', function() {
    // Validación antes de enviar (formularios normal o AJAX)
    const forms = document.querySelectorAll('.credit-form form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const formId = this.closest('.credit-form').id;
            const formType = formId.replace('form-', '');

            if (!validateStep1(formType)) {
                e.preventDefault();
                showValidationMessage('Por favor, corrige los errores antes de enviar.');
                return;
            }

            // Solo mostramos confirmación si es normal (no AJAX)
            // showConfirmation();
        });
    });


// AJAX para el formulario de vivienda
const formVivienda = document.getElementById('form-vivienda-form');  // ID del formulario
const mensajeVivienda = document.getElementById('mensaje-vivienda');

if (formVivienda) {
    formVivienda.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita recargar

        const formData = new FormData(formVivienda);

        fetch(formVivienda.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            mensajeVivienda.textContent = data;
            mensajeVivienda.style.display = 'block';

            // Limpiar formulario
            formVivienda.reset();

            //   volver al paso 1
            const steps = document.querySelectorAll('.form-step');
            steps.forEach(s => s.classList.remove('active'));
            const step1 = document.querySelector('.form-step[data-step="1"]');
            if (step1) step1.classList.add('active');

            // actualizar barra de progreso
            const progressSteps = document.querySelectorAll('.progress-step');
            progressSteps.forEach(p => p.classList.remove('active'));
            if (progressSteps[0]) progressSteps[0].classList.add('active');

        })
        .catch(error => {
            console.error('Error al enviar:', error);
            mensajeVivienda.textContent = '❌ Ocurrió un error al enviar la solicitud.';
            mensajeVivienda.style.display = 'block';
        });
    });
}
// AJAX para el formulario de personal
const formPersonal = document.getElementById('form-personal-form');  // ID del formulario
const mensajePersonal = document.getElementById('mensaje-personal');

if (formPersonal) {
    formPersonal.addEventListener('submit', function(e) {
        e.preventDefault(); // Evita recargar

        const formData = new FormData(formPersonal);

        fetch(formPersonal.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            mensajePersonal.textContent = data;
            mensajePersonal.style.display = 'block';

            // Limpiar formulario
            formPersonal.reset();

            // Volver al paso 1
            const steps = formPersonal.querySelectorAll('.form-step');
            steps.forEach(s => s.classList.remove('active'));
            const step1 = formPersonal.querySelector('.form-step[data-step="1"]');
            if (step1) step1.classList.add('active');

            // Actualizar barra de progreso
            const progressSteps = formPersonal.parentElement.querySelectorAll('.progress-step');
            progressSteps.forEach(p => p.classList.remove('active'));
            if (progressSteps[0]) progressSteps[0].classList.add('active');
        })
        .catch(error => {
            console.error('Error al enviar:', error);
            mensajePersonal.textContent = '❌ Ocurrió un error al enviar la solicitud.';
            mensajePersonal.style.display = 'block';
        });
    });
}


// Funciones de pasos (simplificadas)
function nextStep(step) {
    updateFormStep(step);
    updateSummary();
}

function prevStep(step) {
    updateFormStep(step);
}

function updateFormStep(step) {
    const form = document.getElementById('form-vivienda');
    const steps = form.querySelectorAll('.form-step');
    const progress = form.querySelectorAll('.progress-step');

    steps.forEach(s => s.classList.remove('active'));
    progress.forEach(p => p.classList.remove('active'));

    const currentStep = form.querySelector(`.form-step[data-step="${step}"]`);
    const currentProgress = form.querySelector(`.progress-step[data-step="${step}"]`);

    if (currentStep) currentStep.classList.add('active');
    if (currentProgress) currentProgress.classList.add('active');
}

function updateSummary() {
    const monto = document.getElementById('monto-v').value;
    const plazo = document.getElementById('plazo-v').value;

    document.getElementById('summary-monto-v').textContent = `S/ ${monto}`;
    document.getElementById('summary-plazo-v').textContent = `${plazo} años`;
}

// Ocultar formulario (dummy)
function hideForm() {
    document.getElementById('form-vivienda').style.display = 'none';
}



    // Cerrar overlay de confirmación (si lo usas)
    const closeBtn = document.getElementById('close-confirmation');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            document.getElementById('confirmation-overlay').style.display = 'none';
        });
    }

    // Añadir patrón a DNI y teléfono
    document.querySelectorAll('input[id$="-v"], input[id$="-p"]').forEach(input => {
        if (input.id.includes('dni')) {
            input.pattern = "\\d{8}";
            input.title = "El DNI debe tener 8 dígitos";
        } else if (input.id.includes('telefono')) {
            input.pattern = "\\d{9}";
            input.title = "El teléfono debe tener 9 dígitos";
        }
    });
});

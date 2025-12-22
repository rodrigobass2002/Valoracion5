// =====================================================
// ESTADO
// =====================================================
let currentStep = 1;
const totalSteps = 4;
const formData = {};

// =====================================================
// ELEMENTOS DEL DOM
// =====================================================
const form = document.getElementById('wizardForm');
const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress-step');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const editBtn = document.getElementById('editBtn');

const successModal = document.getElementById('successModal');

// =====================================================
// MOSTRAR PASO
// =====================================================
function showStep(step) {
    steps.forEach((s, index) => {
        s.classList.toggle('active', index + 1 === step);
    });

    progressSteps.forEach((s, index) => {
        s.classList.remove('active', 'completed');

        if (index + 1 < step) s.classList.add('completed');
        if (index + 1 === step) s.classList.add('active');
    });

    prevBtn.style.display = step === 1 ? 'none' : 'inline-block';
    nextBtn.style.display = step === totalSteps ? 'none' : 'inline-block';
    submitBtn.style.display = step === totalSteps ? 'inline-block' : 'none';

    if (step === totalSteps) showSummary();
}

// =====================================================
// VALIDACIÓN
// =====================================================
function validateCurrentStep() {
    const current = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = current.querySelectorAll('input:not([type="checkbox"]), select, textarea');
    let valid = true;

    inputs.forEach(input => {
        const group = input.closest('.form-group');
        const error = group?.querySelector('.error-message');

        group?.classList.remove('error');
        input.classList.remove('valid', 'invalid');
        if (error) error.textContent = '';

        if (input.required && !input.value.trim()) {
            error.textContent = 'Este campo es obligatorio';
            group.classList.add('error');
            input.classList.add('invalid');
            valid = false;
        } else if (input.type === 'email' && !isValidEmail(input.value)) {
            error.textContent = 'Email inválido';
            group.classList.add('error');
            input.classList.add('invalid');
            valid = false;
        } else if (input.pattern && !new RegExp(input.pattern).test(input.value)) {
            error.textContent = 'Formato inválido';
            group.classList.add('error');
            input.classList.add('invalid');
            valid = false;
        } else {
            input.classList.add('valid');
        }
    });

    // Paso 3: intereses
    if (currentStep === 3) {
        const interests = current.querySelectorAll('input[name="interests"]:checked');
        const group = current.querySelector('.checkbox-group').closest('.form-group');
        const error = group.querySelector('.error-message');

        if (!interests.length) {
            error.textContent = 'Selecciona al menos un interés';
            group.classList.add('error');
            valid = false;
        }
    }

    // Paso 4: términos
    if (currentStep === 4) {
        const terms = document.getElementById('terms');
        const group = terms.closest('.form-group');
        const error = group.querySelector('.error-message');

        if (!terms.checked) {
            error.textContent = 'Debes aceptar los términos';
            group.classList.add('error');
            valid = false;
        }
    }

    return valid;
}

// =====================================================
// GUARDAR DATOS
// =====================================================
function saveStepData() {
    const current = document.querySelector(`.form-step[data-step="${currentStep}"]`);
    const inputs = current.querySelectorAll('input, select, textarea');

    inputs.forEach(input => {
        if (input.type === 'checkbox' && input.name === 'interests') {
            if (!formData.interests) formData.interests = [];
            if (input.checked && !formData.interests.includes(input.value)) {
                formData.interests.push(input.value);
            }
        } else if (input.type === 'checkbox') {
            formData[input.name] = input.checked;
        } else if (input.value) {
            formData[input.name] = input.value;
        }
    });

    localStorage.setItem('wizardFormData', JSON.stringify(formData));
}

// =====================================================
// RESUMEN
// =====================================================
function showSummary() {
    document.getElementById('summaryPersonal').innerHTML = `
        <p><strong>Nombre:</strong> ${formData.firstName} ${formData.lastName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Teléfono:</strong> ${formData.phone}</p>
    `;

    document.getElementById('summaryAddress').innerHTML = `
        <p><strong>Dirección:</strong> ${formData.street}</p>
        <p><strong>Ciudad:</strong> ${formData.city}</p>
        <p><strong>Código Postal:</strong> ${formData.zipCode}</p>
        <p><strong>País:</strong> ${formData.country}</p>
    `;

    document.getElementById('summaryPreferences').innerHTML = `
        <p><strong>Intereses:</strong> ${formData.interests?.join(', ') || 'Ninguno'}</p>
        <p><strong>Newsletter:</strong> ${formData.newsletter ? 'Sí' : 'No'}</p>
        ${formData.comments ? `<p><strong>Comentarios:</strong> ${formData.comments}</p>` : ''}
    `;
}

// =====================================================
// EMAIL
// =====================================================
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// =====================================================
// EVENTOS
// =====================================================
nextBtn.addEventListener('click', () => {
    if (validateCurrentStep()) {
        saveStepData();
        currentStep++;
        showStep(currentStep);
    }
});

prevBtn.addEventListener('click', () => {
    currentStep--;
    showStep(currentStep);
});

editBtn?.addEventListener('click', () => {
    currentStep = 1;
    showStep(currentStep);
});

cancelBtn?.addEventListener('click', () => {
    if (confirm('¿Cancelar el registro y borrar los datos?')) {
        localStorage.removeItem('wizardFormData');
        location.reload();
    }
});

form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    saveStepData();
    console.log('✅ Datos enviados:', formData);
    successModal.classList.add('active');
    localStorage.removeItem('wizardFormData');
});

// =====================================================
// INIT
// =====================================================
const saved = localStorage.getItem('wizardFormData');
if (saved) Object.assign(formData, JSON.parse(saved));

showStep(currentStep);

const form = document.getElementById('registrationForm');
const inputs = form.querySelectorAll('input');

// =====================================================
// MENSAJES DE ERROR
// =====================================================
const errorMessages = {
    username: {
        valueMissing: 'El nombre de usuario es obligatorio',
        tooShort: 'El nombre debe tener al menos 3 caracteres'
    },
    email: {
        valueMissing: 'El correo electrónico es obligatorio',
        typeMismatch: 'Ingresa un correo electrónico válido'
    },
    password: {
        valueMissing: 'La contraseña es obligatoria',
        tooShort: 'La contraseña debe tener al menos 8 caracteres'
    },
    confirmPassword: {
        valueMissing: 'Confirma tu contraseña',
        mismatch: 'Las contraseñas no coinciden'
    },
    phone: {
        patternMismatch: 'Ingresa un número de 10 dígitos'
    },
    terms: {
        valueMissing: 'Debes aceptar los términos y condiciones'
    }
};

// =====================================================
// VALIDACIÓN EN TIEMPO REAL
// =====================================================
inputs.forEach(input => {
    input.addEventListener('blur', () => validateField(input));

    input.addEventListener('input', () => {
        if (input.classList.contains('invalid')) {
            validateField(input);
        }

        if (input.id === 'password') {
            checkPasswordStrength(input.value);
        }
    });
});

// =====================================================
// VALIDAR CAMPO
// =====================================================
function validateField(input) {
    const formGroup = input.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');

    // Confirmar contraseña
    if (input.id === 'confirmPassword') {
        const password = document.getElementById('password').value;
        if (input.value !== password) {
            showError(formGroup, errorElement, errorMessages.confirmPassword.mismatch, input);
            return false;
        }
    }

    // Validación HTML5
    if (!input.checkValidity()) {
        const errorType = getErrorType(input.validity);
        const message =
            errorMessages[input.name]?.[errorType] || 'Campo inválido';

        showError(formGroup, errorElement, message, input);
        return false;
    }

    showSuccess(formGroup, errorElement, input);
    return true;
}

// =====================================================
// TIPO DE ERROR
// =====================================================
function getErrorType(validity) {
    if (validity.valueMissing) return 'valueMissing';
    if (validity.typeMismatch) return 'typeMismatch';
    if (validity.tooShort) return 'tooShort';
    if (validity.patternMismatch) return 'patternMismatch';
    return 'invalid';
}

// =====================================================
// MOSTRAR ERROR
// =====================================================
function showError(formGroup, errorElement, message, input) {
    formGroup.classList.add('error');
    formGroup.classList.remove('valid');

    if (input.type !== 'checkbox') {
        input.classList.add('invalid');
        input.classList.remove('valid');
    }

    errorElement.textContent = message;
}

// =====================================================
// MOSTRAR ÉXITO
// =====================================================
function showSuccess(formGroup, errorElement, input) {
    formGroup.classList.remove('error');
    formGroup.classList.add('valid');

    if (input.type !== 'checkbox') {
        input.classList.remove('invalid');
        input.classList.add('valid');
    }

    errorElement.textContent = '';
}

// =====================================================
// FUERZA DE CONTRASEÑA
// =====================================================
function checkPasswordStrength(password) {
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');

    let strength = 0;

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    strengthBar.className = 'strength-bar';

    if (strength <= 2) {
        strengthBar.classList.add('weak');
        strengthText.textContent = 'Débil';
    } else if (strength <= 4) {
        strengthBar.classList.add('medium');
        strengthText.textContent = 'Media';
    } else {
        strengthBar.classList.add('strong');
        strengthText.textContent = 'Fuerte';
    }
}

// =====================================================
// SUBMIT
// =====================================================
form.addEventListener('submit', e => {
    e.preventDefault();

    let isValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        mostrarMensaje('Corrige los errores antes de continuar');
        return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log('✅ Registro válido:', data);
    mostrarMensaje('Registro exitoso 🎉', true);

    form.reset();
});

// =====================================================
// MENSAJE SIMPLE (UX)
–=====================================================
function mostrarMensaje(texto, success = false) {
    const msg = document.createElement('div');
    msg.textContent = texto;
    msg.style.position = 'fixed';
    msg.style.bottom = '30px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.padding = '12px 24px';
    msg.style.borderRadius = '999px';
    msg.style.background = success ? '#16a34a' : '#dc2626';
    msg.style.color = 'white';
    msg.style.fontSize = '0.85rem';
    msg.style.zIndex = '9999';

    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2500);
}

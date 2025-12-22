// ==========================================================
// ELEMENTOS DEL DOM
// ==========================================================
const form = document.getElementById('generatorForm');
const lengthInput = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const uppercaseCheck = document.getElementById('uppercase');
const lowercaseCheck = document.getElementById('lowercase');
const numbersCheck = document.getElementById('numbers');
const symbolsCheck = document.getElementById('symbols');
const passwordOutput = document.getElementById('passwordOutput');
const copyBtn = document.getElementById('copyBtn');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');
const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const toast = document.getElementById('toast');

// ==========================================================
// CONSTANTES
// ==========================================================
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

// ==========================================================
// HISTORIAL
// ==========================================================
let history = JSON.parse(localStorage.getItem('passwordHistory')) || [];

// ==========================================================
// GENERAR CONTRASEÑA
// ==========================================================
function generarPassword(length, options) {
    let charset = '';
    let password = '';

    if (options.uppercase) charset += UPPERCASE;
    if (options.lowercase) charset += LOWERCASE;
    if (options.numbers) charset += NUMBERS;
    if (options.symbols) charset += SYMBOLS;

    if (!charset) {
        mostrarToast('⚠ Selecciona al menos una opción');
        return null;
    }

    for (let i = 0; i < length; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Asegurar variedad
    if (options.uppercase && !/[A-Z]/.test(password)) password = reemplazarUltimo(password, UPPERCASE);
    if (options.lowercase && !/[a-z]/.test(password)) password = reemplazarUltimo(password, LOWERCASE);
    if (options.numbers && !/[0-9]/.test(password)) password = reemplazarUltimo(password, NUMBERS);
    if (options.symbols && !/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) password = reemplazarUltimo(password, SYMBOLS);

    return password.split('').sort(() => Math.random() - 0.5).join('');
}

function reemplazarUltimo(password, chars) {
    return password.slice(0, -1) + chars[Math.floor(Math.random() * chars.length)];
}

// ==========================================================
// FUERZA DE CONTRASEÑA
// ==========================================================
function calcularFuerza(password) {
    let score = 0;

    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 10;

    if (/[a-z]/.test(password)) score += 15;
    if (/[A-Z]/.test(password)) score += 15;
    if (/[0-9]/.test(password)) score += 10;
    if (/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) score += 10;

    return Math.min(score, 100);
}

function actualizarFuerza(password) {
    const fuerza = calcularFuerza(password);
    strengthBar.style.width = `${fuerza}%`;

    if (fuerza < 40) {
        strengthBar.style.background = '#f43f5e';
        strengthText.textContent = 'Fuerza: Débil';
        strengthText.style.color = '#f43f5e';
    } else if (fuerza < 70) {
        strengthBar.style.background = '#facc15';
        strengthText.textContent = 'Fuerza: Aceptable';
        strengthText.style.color = '#facc15';
    } else {
        strengthBar.style.background = '#22c55e';
        strengthText.textContent = 'Fuerza: Fuerte';
        strengthText.style.color = '#22c55e';
    }
}

// ==========================================================
// CLIPBOARD
// ==========================================================
async function copiarAlPortapapeles(text) {
    try {
        await navigator.clipboard.writeText(text);
        mostrarToast('✓ Copiado al portapapeles');
    } catch {
        const temp = document.createElement('textarea');
        temp.value = text;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        mostrarToast('✓ Copiado');
    }
}

// ==========================================================
// TOAST
// ==========================================================
function mostrarToast(mensaje) {
    toast.textContent = mensaje;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

// ==========================================================
// HISTORIAL
// ==========================================================
function guardarEnHistorial(password) {
    history.unshift(password);
    history = history.slice(0, 10);
    localStorage.setItem('passwordHistory', JSON.stringify(history));
    renderizarHistorial();
}

function renderizarHistorial() {
    if (!history.length) {
        historyList.innerHTML = '<p class="empty">Sin contraseñas aún</p>';
        clearHistoryBtn.style.display = 'none';
        return;
    }

    clearHistoryBtn.style.display = 'block';
    historyList.innerHTML = history.map(pwd => `
        <div class="history-item">
            <span class="history-password">${pwd}</span>
            <button class="history-copy" data-pwd="${pwd}">Copiar</button>
        </div>
    `).join('');
}

// Delegación de eventos (mejor práctica)
historyList.addEventListener('click', e => {
    if (e.target.classList.contains('history-copy')) {
        copiarAlPortapapeles(e.target.dataset.pwd);
    }
});

// ==========================================================
// EVENTOS
// ==========================================================
lengthInput.addEventListener('input', () => {
    lengthValue.textContent = lengthInput.value;
});

form.addEventListener('submit', e => {
    e.preventDefault();

    const password = generarPassword(parseInt(lengthInput.value), {
        uppercase: uppercaseCheck.checked,
        lowercase: lowercaseCheck.checked,
        numbers: numbersCheck.checked,
        symbols: symbolsCheck.checked
    });

    if (!password) return;

    passwordOutput.value = password;
    actualizarFuerza(password);
    guardarEnHistorial(password);

    passwordOutput.style.transform = 'scale(1.06)';
    setTimeout(() => passwordOutput.style.transform = 'scale(1)', 180);
});

copyBtn.addEventListener('click', () => {
    if (passwordOutput.value && !passwordOutput.value.includes('Haz clic')) {
        copiarAlPortapapeles(passwordOutput.value);
    } else {
        mostrarToast('⚠ Genera una contraseña primero');
    }
});

clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('passwordHistory');
    renderizarHistorial();
    mostrarToast('Historial eliminado');
});

window.addEventListener('DOMContentLoaded', () => {
    renderizarHistorial();
    form.dispatchEvent(new Event('submit'));
});

console.log('🔐 Password Generator listo');

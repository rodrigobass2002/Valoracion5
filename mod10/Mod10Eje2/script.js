// =====================================================
// ELEMENTOS DEL DOM
// =====================================================
const form = document.getElementById('imcForm');
const pesoInput = document.getElementById('peso');
const alturaInput = document.getElementById('altura');
const edadInput = document.getElementById('edad');

const resultSection = document.getElementById('resultSection');
const imcValue = document.getElementById('imcValue');
const imcCategory = document.getElementById('imcCategory');
const imcIndicator = document.getElementById('imcIndicator');
const recommendationText = document.getElementById('recommendationText');

const historyList = document.getElementById('historyList');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

// =====================================================
// HISTORIAL
// =====================================================
let history = JSON.parse(localStorage.getItem('imcHistory')) || [];

// =====================================================
// CÁLCULO IMC
// =====================================================
function calcularIMC(peso, alturaCm) {
    const alturaM = alturaCm / 100;
    return peso / (alturaM * alturaM);
}

function obtenerCategoria(imc) {
    if (imc < 18.5) return 'Bajo peso';
    if (imc < 25) return 'Normal';
    if (imc < 30) return 'Sobrepeso';
    return 'Obesidad';
}

function obtenerColor(imc) {
    if (imc < 18.5) return '#38bdf8';
    if (imc < 25) return '#22c55e';
    if (imc < 30) return '#facc15';
    return '#ef4444';
}

function obtenerRecomendaciones(categoria) {
    const map = {
        'Bajo peso': 'Tu peso está por debajo del rango saludable. Considera una evaluación nutricional.',
        'Normal': 'Excelente, mantén hábitos saludables y actividad física regular.',
        'Sobrepeso': 'Podrías beneficiarte de una dieta balanceada y ejercicio constante.',
        'Obesidad': 'Es recomendable consultar con un profesional de la salud.'
    };
    return map[categoria] || '';
}

// =====================================================
// INDICADOR
// =====================================================
function posicionarIndicador(imc) {
    let porcentaje = 0;

    if (imc < 18.5) porcentaje = (imc / 18.5) * 25;
    else if (imc < 25) porcentaje = 25 + ((imc - 18.5) / 6.5) * 25;
    else if (imc < 30) porcentaje = 50 + ((imc - 25) / 5) * 25;
    else porcentaje = 75 + Math.min(((imc - 30) / 10) * 25, 25);

    imcIndicator.style.left = `${porcentaje}%`;
}

// =====================================================
// RESULTADO
// =====================================================
function mostrarResultado(imc, categoria) {
    imcValue.textContent = imc.toFixed(1);
    imcCategory.textContent = categoria;
    imcCategory.style.color = obtenerColor(imc);

    posicionarIndicador(imc);
    recommendationText.textContent = obtenerRecomendaciones(categoria);

    resultSection.style.display = 'block';
    resultSection.scrollIntoView({ behavior: 'smooth' });
}

// =====================================================
// HISTORIAL
// =====================================================
function guardarEnHistorial(peso, altura, imc, categoria) {
    history.unshift({
        peso,
        altura,
        imc: imc.toFixed(1),
        categoria,
        fecha: new Date().toLocaleString('es-ES')
    });

    history = history.slice(0, 10);
    localStorage.setItem('imcHistory', JSON.stringify(history));
    renderizarHistorial();
}

function renderizarHistorial() {
    if (!history.length) {
        historyList.innerHTML = '<p class="empty-history">No hay cálculos previos</p>';
        clearHistoryBtn.style.display = 'none';
        return;
    }

    clearHistoryBtn.style.display = 'block';

    historyList.innerHTML = history.map(item => `
        <div class="history-item">
            <div class="history-info">
                <div>Peso: ${item.peso}kg | Altura: ${item.altura}cm</div>
                <div class="history-date">${item.fecha}</div>
            </div>
            <div>
                <div class="history-imc">${item.imc}</div>
                <div style="color:${obtenerColor(parseFloat(item.imc))}">
                    ${item.categoria}
                </div>
            </div>
        </div>
    `).join('');
}

// =====================================================
// VALIDACIÓN
// =====================================================
function validarCampo(input) {
    const value = parseFloat(input.value);
    const min = parseFloat(input.min);
    const max = parseFloat(input.max);
    const errorSpan = input.parentElement.querySelector('.error-message');

    if (!input.value || isNaN(value) || value < min || value > max) {
        errorSpan.textContent = `Debe estar entre ${min} y ${max}`;
        input.classList.add('invalid');
        input.classList.remove('valid');
        return false;
    }

    errorSpan.textContent = '';
    input.classList.add('valid');
    input.classList.remove('invalid');
    return true;
}

[pesoInput, alturaInput, edadInput].forEach(input =>
    input.addEventListener('input', () => validarCampo(input))
);

// =====================================================
// SUBMIT
// =====================================================
form.addEventListener('submit', e => {
    e.preventDefault();

    const valido =
        validarCampo(pesoInput) &
        validarCampo(alturaInput) &
        validarCampo(edadInput);

    if (!valido) {
        mostrarMensaje('Completa los campos correctamente');
        return;
    }

    const peso = +pesoInput.value;
    const altura = +alturaInput.value;

    const imc = calcularIMC(peso, altura);
    const categoria = obtenerCategoria(imc);

    mostrarResultado(imc, categoria);
    guardarEnHistorial(peso, altura, imc, categoria);
});

// =====================================================
// LIMPIAR HISTORIAL
// =====================================================
clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('imcHistory');
    renderizarHistorial();
    mostrarMensaje('Historial eliminado', true);
});

// =====================================================
// MENSAJE VISUAL
// =====================================================
function mostrarMensaje(texto, success = false) {
    const msg = document.createElement('div');
    msg.textContent = texto;
    msg.style.position = 'fixed';
    msg.style.bottom = '24px';
    msg.style.left = '50%';
    msg.style.transform = 'translateX(-50%)';
    msg.style.padding = '12px 22px';
    msg.style.borderRadius = '999px';
    msg.style.background = success ? '#22c55e' : '#ef4444';
    msg.style.color = '#fff';
    msg.style.fontSize = '0.85rem';
    msg.style.zIndex = '9999';

    document.body.appendChild(msg);
    setTimeout(() => msg.remove(), 2200);
}

// =====================================================
// INIT
// =====================================================
renderizarHistorial();
console.log('✅ Calculadora de IMC lista');

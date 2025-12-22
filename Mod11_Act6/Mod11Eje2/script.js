// ================================
// CONFIGURACIÓN API
// ================================
const API_KEY = 'TU_API_KEY_AQUI'; // ⛔ Reemplaza con tu API Key real
const API_BASE = 'https://api.openweathermap.org/data/2.5';

// ================================
// ESTADO
// ================================
let currentUnit = 'metric';
let favorites = JSON.parse(localStorage.getItem('weatherFavorites')) || [];
let currentCityData = null;

// ================================
// ELEMENTOS DOM (SEGÚN TU HTML)
// ================================
const currentWeatherDiv = document.getElementById('currentWeather');
const forecastGrid = document.getElementById('forecastGrid');
const favoritesList = document.getElementById('favoritesList');
const citySelect = document.getElementById('citySelect');
const searchBtn = document.getElementById('searchBtn');
const unitToggle = document.getElementById('unitToggle');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');

// ================================
// OBTENER CLIMA POR CIUDAD
// ================================
async function getWeatherByCity(city) {
    try {
        showLoading();
        const response = await fetch(
            `${API_BASE}/weather?q=${city}&units=${currentUnit}&appid=${API_KEY}&lang=es`
        );

        if (!response.ok) {
            throw new Error('Ciudad no encontrada');
        }

        const data = await response.json();
        currentCityData = data;
        displayCurrentWeather(data);
        getForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        showError(error.message);
    }
}

// ================================
// PRONÓSTICO 5 DÍAS
// ================================
async function getForecast(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE}/forecast?lat=${lat}&lon=${lon}&units=${currentUnit}&appid=${API_KEY}&lang=es`
        );
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error al obtener pronóstico:', error);
    }
}

// ================================
// MOSTRAR CLIMA ACTUAL
// ================================
function displayCurrentWeather(data) {
    const isFavorite = favorites.some(fav => fav.id === data.id);
    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';
    const speedUnit = currentUnit === 'metric' ? 'km/h' : 'mph';

    currentWeatherDiv.innerHTML = `
        <div class="weather-main">
            <div class="weather-info">
                <h2>${data.name}, ${data.sys.country}</h2>
                <div class="weather-temp">${Math.round(data.main.temp)}${unitSymbol}</div>
                <div class="weather-description">${data.weather[0].description}</div>
                <button class="fav-btn" onclick="toggleFavorite(${data.id}, '${data.name}')">
                    ${isFavorite ? '⭐ Eliminar de favoritos' : '☆ Añadir a favoritos'}
                </button>
            </div>
            <div class="weather-icon">
                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png">
            </div>
        </div>
        <div class="weather-details">
            <div class="detail-item"><strong>Sensación térmica</strong>${Math.round(data.main.feels_like)}${unitSymbol}</div>
            <div class="detail-item"><strong>Humedad</strong>${data.main.humidity}%</div>
            <div class="detail-item"><strong>Viento</strong>${Math.round(data.wind.speed)} ${speedUnit}</div>
            <div class="detail-item"><strong>Presión</strong>${data.main.pressure} hPa</div>
        </div>
    `;
}

// ================================
// MOSTRAR PRONÓSTICO
// ================================
function displayForecast(data) {
    const daily = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);
    const unitSymbol = currentUnit === 'metric' ? '°C' : '°F';

    forecastGrid.innerHTML = daily.map(day => {
        const date = new Date(day.dt * 1000);
        const name = date.toLocaleDateString('es', { weekday: 'short' });
        return `
            <div class="forecast-card">
                <div class="day">${name}</div>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">
                <div class="temp">${Math.round(day.main.temp)}${unitSymbol}</div>
                <div class="description">${day.weather[0].description}</div>
            </div>
        `;
    }).join('');
}

// ================================
// FAVORITOS
// ================================
function toggleFavorite(id, name) {
    const index = favorites.findIndex(f => f.id === id);
    if (index > -1) favorites.splice(index, 1);
    else favorites.push({ id, name });

    localStorage.setItem('weatherFavorites', JSON.stringify(favorites));
    displayFavorites();
    displayCurrentWeather(currentCityData);
}

function displayFavorites() {
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-state">No hay ciudades favoritas aún</p>';
        return;
    }

    favoritesList.innerHTML = favorites.map(fav => `
        <div class="favorite-item" onclick="getWeatherByCity('${fav.name},BO')">
            <span>${fav.name}</span>
            <button onclick="event.stopPropagation(); toggleFavorite(${fav.id}, '${fav.name}')">✕</button>
        </div>
    `).join('');
}

// ================================
// CAMBIO DE UNIDADES
// ================================
function toggleUnits() {
    currentUnit = currentUnit === 'metric' ? 'imperial' : 'metric';
    unitToggle.textContent = currentUnit === 'metric' ? '°C' : '°F';
    if (currentCityData) {
        getWeatherByCity(`${currentCityData.name},BO`);
    }
}

// ================================
// UTILIDADES
// ================================
function showLoading() {
    currentWeatherDiv.innerHTML = '<div class="loading">⏳ Cargando...</div>';
}

function showError(message) {
    errorMessage.textContent = message;
    errorModal.classList.add('active');
}

// ================================
// EVENTOS
// ================================
searchBtn.addEventListener('click', () => {
    const city = citySelect.value;
    if (city) getWeatherByCity(city);
});

citySelect.addEventListener('change', () => {
    const city = citySelect.value;
    if (city) getWeatherByCity(city);
});

unitToggle.addEventListener('click', toggleUnits);

// ================================
// INIT
// ================================
displayFavorites();
getWeatherByCity('La Paz,BO');

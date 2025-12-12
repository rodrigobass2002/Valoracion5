// ==============================================
// NAVBAR STICKY - JAVASCRIPT
// ==============================================

// Elementos
const navbar = document.getElementById('navbar');
const btnTop = document.getElementById('btnTop');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const form = document.querySelector('.contact-form');
const submitButton = document.querySelector('.btn-submit');
const confirmationMessage = document.querySelector('.confirmation-message'); // Verifica que este selector sea correcto

// ===== NAVBAR SCROLLED =====
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Añadir clase .scrolled cuando scrolleamos hacia abajo
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Mostrar botón "Volver arriba" después de 300px
    if (currentScroll > 300) {
        btnTop.classList.add('visible');
    } else {
        btnTop.classList.remove('visible');
    }

    lastScroll = currentScroll;
});

// ===== VOLVER ARRIBA =====
btnTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== MENÚ HAMBURGUESA =====
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Cerrar menú al hacer click en enlace
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Cerrar menú al hacer click fuera
document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

// ===== HIGHLIGHT ACTIVE SECTION =====
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (pageYOffset >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===== SMOOTH SCROLL PARA NAVEGADORES ANTIGUOS =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href').startsWith('#')) {
            e.preventDefault();

            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// ===== MENSAJE DE CONFIRMACIÓN "MENSAJE ENVIADO" =====
submitButton.addEventListener('click', (e) => {
    e.preventDefault(); // Evitar el envío del formulario por defecto

    // Verificar que el mensaje de confirmación existe
    if (confirmationMessage) {
        // Mostrar el mensaje de confirmación
        confirmationMessage.style.display = 'block';

        // Ocultar el mensaje después de 3 segundos
        setTimeout(() => {
            confirmationMessage.style.display = 'none';
        }, 3000);
    } else {
        console.error("El mensaje de confirmación no se encontró");
    }
});

// ===== LOG INICIAL =====
console.log('🎯 Navbar Sticky Demo Cargado');
console.log('📍 Position: sticky con JavaScript para mejorar UX');
console.log('⬆️ Scroll hacia abajo para ver el navbar pegarse');
console.log('💡 Características:');
console.log('  - Navbar con position: sticky');
console.log('  - Clase .scrolled añadida con JS');
console.log('  - Botón "Volver arriba" con position: fixed');
console.log('  - Smooth scroll entre secciones');
console.log('  - Menú hamburguesa responsive');

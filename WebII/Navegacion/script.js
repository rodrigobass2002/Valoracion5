/* ===============================================
   NAVEGACIÓN INTERACTIVA MEJORADA
   =============================================== */

// Seleccionar elementos
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scrollTop');

/* ===============================================
   MENÚ HAMBURGUESA
   =============================================== */

// Toggle del menú
navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Cerrar menú al hacer click en un enlace
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

/* ===============================================
   NAVEGACIÓN CON SCROLL
   =============================================== */

// Marcar enlace activo según scroll
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section[id]');
    
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

    // Agregar clase 'scrolled' al navbar
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Mostrar/ocultar botón scroll to top
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

/* ===============================================
   SCROLL TO TOP
   =============================================== */

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

/* ===============================================
   SMOOTH SCROLL PARA NAVEGACIÓN
   =============================================== */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 70; // 70px = altura del navbar
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ===============================================
   ANIMACIONES AL HACER SCROLL (INTERSECTION OBSERVER)
   =============================================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos que se animan
document.querySelectorAll('.service-card, .portfolio-item, .team-member, .blog-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

/* ===============================================
   FORMULARIO DE CONTACTO
   =============================================== */

const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Aquí puedes agregar la lógica para enviar el formulario
        // Por ahora solo mostramos un mensaje
        
        alert('¡Gracias por tu mensaje! Te contactaremos pronto.');
        contactForm.reset();
    });
}

/* ===============================================
   FORMULARIO NEWSLETTER
   =============================================== */

const newsletterForm = document.querySelector('.newsletter-form');

if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = newsletterForm.querySelector('input[type="email"]').value;
        
        if (email) {
            alert(`¡Gracias por suscribirte! Te enviaremos noticias a ${email}`);
            newsletterForm.reset();
        }
    });
}

/* ===============================================
   PRELOADER (OPCIONAL)
   =============================================== */

window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

/* ===============================================
   ANIMACIÓN DE CONTADORES (SI LOS AGREGAS)
   =============================================== */

function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60 FPS
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start);
        }
    }, 16);
}

/* ===============================================
   CONSOLE LOG CON ESTILO
   =============================================== */

console.log('%c🚀 TechCorp Website', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%c✨ Características:', 'color: #10b981; font-size: 16px; font-weight: bold;');
console.log('%c  ✓ Navegación responsive con menú hamburguesa', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ Scroll suave y detección de sección activa', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ Animaciones con Intersection Observer', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ Botón scroll to top', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ Formularios interactivos', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ 100% Responsive', 'color: #6b7280; font-size: 14px;');
console.log('%c\n💼 Desarrollado por TechCorp', 'color: #764ba2; font-size: 14px;');

/* ===============================================
   LAZY LOADING DE IMÁGENES (OPCIONAL)
   =============================================== */

if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src;
    });
} else {
    // Fallback para navegadores que no soportan lazy loading nativo
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

/* ===============================================
   DETECCIÓN DE MODO OSCURO DEL SISTEMA (OPCIONAL)
   =============================================== */

// Detectar preferencia de modo oscuro
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    console.log('Modo oscuro detectado en el sistema');
    // Aquí puedes agregar lógica para modo oscuro
}

// Escuchar cambios en la preferencia de modo
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        console.log('Cambió a modo oscuro');
    } else {
        console.log('Cambió a modo claro');
    }
});

/* ===============================================
   PERFORMANCE: DEBOUNCE PARA EVENTOS DE SCROLL
   =============================================== */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Usar debounce para optimizar el scroll
const optimizedScroll = debounce(() => {
    // Código de scroll optimizado
}, 100);

window.addEventListener('scroll', optimizedScroll);
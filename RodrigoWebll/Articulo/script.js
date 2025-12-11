/* =====================================
   BLOG MODERNO - JAVASCRIPT
   ===================================== */

// Selección de elementos
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');
const scrollTopBtn = document.getElementById('scrollTop');
const readingProgress = document.getElementById('readingProgress');
const siteHeader = document.getElementById('siteHeader');

/* ===== MENÚ MÓVIL ===== */
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
    });

    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        });
    });

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!mobileMenuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            mobileMenuToggle.classList.remove('active');
            mainNav.classList.remove('active');
        }
    });
}

/* ===== DARK MODE ===== */
if (themeToggle) {
    // Verificar preferencia guardada
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        if (document.body.classList.contains('dark-mode')) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });
}

/* ===== SCROLL TO TOP ===== */
if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }

        // Agregar clase scrolled al header
        if (window.pageYOffset > 50) {
            siteHeader?.classList.add('scrolled');
        } else {
            siteHeader?.classList.remove('scrolled');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ===== BARRA DE PROGRESO DE LECTURA ===== */
if (readingProgress) {
    window.addEventListener('scroll', () => {
        const article = document.querySelector('.article-content');
        if (!article) return;

        const articleTop = article.offsetTop;
        const articleHeight = article.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        const articleBottom = articleTop + articleHeight;
        const windowBottom = scrollTop + windowHeight;

        if (scrollTop >= articleTop && scrollTop <= articleBottom) {
            const progress = ((scrollTop - articleTop) / (articleHeight - windowHeight)) * 100;
            readingProgress.style.width = Math.min(Math.max(progress, 0), 100) + '%';
        } else if (scrollTop < articleTop) {
            readingProgress.style.width = '0%';
        } else {
            readingProgress.style.width = '100%';
        }
    });
}

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

/* ===== COMPARTIR EN REDES SOCIALES ===== */
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const platform = this.dataset.platform;
        const url = window.location.href;
        const title = document.querySelector('.article-title').textContent;
        
        let shareUrl = '';
        
        switch(platform) {
            case 'twitter':
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                break;
            case 'facebook':
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                break;
            case 'linkedin':
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                break;
            case 'whatsapp':
                shareUrl = `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`;
                break;
        }
        
        if (shareUrl) {
            window.open(shareUrl, '_blank', 'width=600,height=400');
        }
    });
});

/* ===== ANIMACIONES AL SCROLL (INTERSECTION OBSERVER) ===== */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animar
document.querySelectorAll('.trend-card, .stat-card, .tool-card, .widget').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

/* ===== COPIAR CÓDIGO ===== */
document.querySelectorAll('pre code').forEach(block => {
    const button = document.createElement('button');
    button.className = 'copy-code-btn';
    button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
    
    const pre = block.parentElement;
    pre.style.position = 'relative';
    pre.appendChild(button);
    
    button.addEventListener('click', async () => {
        await navigator.clipboard.writeText(block.textContent);
        button.innerHTML = '<i class="fas fa-check"></i> Copiado';
        
        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-copy"></i> Copiar';
        }, 2000);
    });
});

/* ===== FORMULARIO DE BÚSQUEDA ===== */
const searchForm = document.querySelector('.search-form');
if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const searchInput = searchForm.querySelector('input[type="search"]');
        const searchTerm = searchInput.value.trim();
        
        if (searchTerm) {
            console.log('Buscando:', searchTerm);
            // Aquí puedes implementar la lógica de búsqueda
            alert(`Buscando: ${searchTerm}`);
        }
    });
}

/* ===== FORMULARIO DE NEWSLETTER ===== */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = newsletterForm.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (email) {
            console.log('Suscripción:', email);
            alert(`¡Gracias por suscribirte! Te enviaremos noticias a ${email}`);
            newsletterForm.reset();
        }
    });
}

/* ===== LAZY LOADING DE IMÁGENES ===== */
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback para navegadores antiguos
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

/* ===== TRACKING DE TIEMPO DE LECTURA ===== */
let startTime = Date.now();
let totalReadingTime = 0;

window.addEventListener('beforeunload', () => {
    totalReadingTime = Math.floor((Date.now() - startTime) / 1000);
    console.log(`Tiempo de lectura: ${totalReadingTime} segundos`);
    // Aquí puedes enviar esta información a tu sistema de analíticas
});

/* ===== DETECTAR PREFERENCIA DE MODO OSCURO DEL SISTEMA ===== */
if (window.matchMedia && !localStorage.getItem('theme')) {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark-mode');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    }
}

/* ===== TOOLTIPS PERSONALIZADOS ===== */
document.querySelectorAll('[data-tooltip]').forEach(element => {
    element.addEventListener('mouseenter', function() {
        const tooltip = document.createElement('div');
        tooltip.className = 'custom-tooltip';
        tooltip.textContent = this.dataset.tooltip;
        document.body.appendChild(tooltip);
        
        const rect = this.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        
        this._tooltip = tooltip;
    });
    
    element.addEventListener('mouseleave', function() {
        if (this._tooltip) {
            this._tooltip.remove();
            this._tooltip = null;
        }
    });
});

/* ===== MENSAJES DE CONSOLA ===== */
console.log('%c📝 DevBlog Moderno', 'color: #6366f1; font-size: 24px; font-weight: bold;');
console.log('%c✨ Características:', 'color: #10b981; font-size: 16px; font-weight: bold;');
console.log('%c  ✓ Dark Mode con persistencia', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ Barra de progreso de lectura', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ Compartir en redes sociales', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ Animaciones suaves con Intersection Observer', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ Menú móvil responsive', 'color: #6b7280; font-size: 14px;');
console.log('%c  ✓ 100% Responsive', 'color: #6b7280; font-size: 14px;');
console.log('%c\n💼 Desarrollado con ❤️', 'color: #f59e0b; font-size: 14px;');

/* ===== PERFORMANCE: DEBOUNCE ===== */
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

// Optimizar eventos de scroll
const optimizedScroll = debounce(() => {
    // Código de scroll optimizado ya implementado arriba
}, 100);

/* ===== COPIAR ENLACE DEL ARTÍCULO ===== */
function copyArticleLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        alert('¡Enlace copiado al portapapeles!');
    });
}

// Si hay un botón para copiar enlace, agregar funcionalidad
const copyLinkBtn = document.querySelector('[data-action="copy-link"]');
if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', copyArticleLink);
}

/* ===== ANALÍTICAS (PLACEHOLDER) ===== */
function trackEvent(eventName, eventData) {
    console.log('Evento rastreado:', eventName, eventData);
    // Aquí puedes integrar Google Analytics, Mixpanel, etc.
}

// Rastrear clics en enlaces externos
document.querySelectorAll('a[href^="http"]').forEach(link => {
    if (!link.href.includes(window.location.hostname)) {
        link.addEventListener('click', () => {
            trackEvent('external_link_click', {
                url: link.href,
                text: link.textContent
            });
        });
    }
});
/* ===== CONTACTO: MARCAR BOTÓN ACTIVO Y SCROLL ===== */

// Detectar enlace Contacto correctamente
const contactoLink = document.querySelector('a[href="#contacto"]');
const contactoSection = document.getElementById('contacto');

if (contactoLink && contactoSection) {

    // Cuando se hace clic, se resalta temporalmente
    contactoLink.addEventListener('click', () => {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        contactoLink.classList.add('active');
    });

    // Detectar cuando el usuario llega a la sección de contacto
    const contactoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                contactoLink.classList.add('active');
            }
        });
    }, {
        threshold: 0.4
    });

    contactoObserver.observe(contactoSection);
}

/* =====================================================
   1. BASE DE DATOS FICTICIA
===================================================== */
const products = [
    {
        id: 1,
        name: "MacBook Air M2",
        category: "Tecnología",
        price: 999,
        rating: 5,
        image: "https://picsum.photos/400/300?random=11"
    },
    {
        id: 2,
        name: "Sudadera Oversize",
        category: "Ropa",
        price: 45,
        rating: 4,
        image: "https://picsum.photos/400/300?random=12"
    },
    {
        id: 3,
        name: "Cafetera Espresso",
        category: "Hogar",
        price: 120,
        rating: 4,
        image: "https://picsum.photos/400/300?random=13"
    },
    {
        id: 4,
        name: "Teclado Mecánico",
        category: "Tecnología",
        price: 85,
        rating: 5,
        image: "https://picsum.photos/400/300?random=14"
    },
    {
        id: 5,
        name: "Pantalón Denim",
        category: "Ropa",
        price: 60,
        rating: 3,
        image: "https://picsum.photos/400/300?random=15"
    },
    {
        id: 6,
        name: "Lámpara de Pie",
        category: "Hogar",
        price: 35,
        rating: 2,
        image: "https://picsum.photos/400/300?random=16"
    },
    {
        id: 7,
        name: "iPhone 15",
        category: "Tecnología",
        price: 800,
        rating: 5,
        image: "https://picsum.photos/400/300?random=17"
    },
    {
        id: 8,
        name: "Zapatillas Running",
        category: "Ropa",
        price: 110,
        rating: 4,
        image: "https://picsum.photos/400/300?random=18"
    },
    {
        id: 9,
        name: "Set de Cuchillos",
        category: "Hogar",
        price: 75,
        rating: 3,
        image: "https://picsum.photos/400/300?random=19"
    },
    {
        id: 10,
        name: "Monitor 4K",
        category: "Tecnología",
        price: 400,
        rating: 4,
        image: "https://picsum.photos/400/300?random=20"
    }
];

const ITEMS_PER_PAGE = 6;

/* =====================================================
   2. REFERENCIAS DOM
===================================================== */
const grid = document.getElementById('productsGrid');
const loadingText = document.getElementById('loadingText');
const pageInfo = document.getElementById('pageInfo');

const searchInput = document.getElementById('searchInput');
const categorySelect = document.getElementById('categorySelect');
const priceRange = document.getElementById('priceRange');
const priceValue = document.getElementById('priceValue');
const ratingSelect = document.getElementById('ratingSelect');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const clearBtn = document.getElementById('clearFilters');

/* =====================================================
   3. DEBOUNCE
===================================================== */
function debounce(fn, delay = 400) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), delay);
    };
}

/* =====================================================
   4. URL SYNC
===================================================== */
function syncURL() {
    const params = new URLSearchParams();

    if (searchInput.value) params.set('q', searchInput.value);
    if (categorySelect.value) params.set('category', categorySelect.value);
    if (ratingSelect.value > 0) params.set('rating', ratingSelect.value);
    params.set('price', priceRange.value);
    params.set('page', 1);

    history.pushState(null, '', `?${params.toString()}`);
    render();
}

/* =====================================================
   5. RENDER PRINCIPAL
===================================================== */
function render() {
    const params = new URLSearchParams(location.search);

    const q = params.get('q')?.toLowerCase() || '';
    const category = params.get('category') || '';
    const maxPrice = parseInt(params.get('price')) || 1000;
    const rating = parseInt(params.get('rating')) || 0;
    let page = parseInt(params.get('page')) || 1;

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(q) &&
        (!category || p.category === category) &&
        p.price <= maxPrice &&
        p.rating >= rating
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
    if (page > totalPages) page = totalPages;

    const start = (page - 1) * ITEMS_PER_PAGE;
    const visible = filtered.slice(start, start + ITEMS_PER_PAGE);

    grid.innerHTML = visible.length
        ? visible.map(p => `
            <div class="product-card">
                <img src="${p.image}" alt="${p.name}">
                <div class="product-info">
                    <h3>${p.name}</h3>
                    <p>${p.category}</p>
                    <div class="product-footer">
                        <span class="price">$${p.price}</span>
                        <span>⭐ ${p.rating}</span>
                    </div>
                    <button class="btn btn-primary">Ver producto</button>
                </div>
            </div>
        `).join('')
        : `<p>No se encontraron productos.</p>`;

    loadingText.textContent = `${filtered.length} productos encontrados`;
    pageInfo.textContent = `Página ${page} de ${totalPages}`;

    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= totalPages;

    priceValue.textContent = `$${maxPrice}`;
}

/* =====================================================
   6. EVENTOS
===================================================== */
searchInput.addEventListener('input', debounce(syncURL));
categorySelect.addEventListener('change', syncURL);
ratingSelect.addEventListener('change', syncURL);

priceRange.addEventListener('input', () => {
    priceValue.textContent = `$${priceRange.value}`;
    syncURL();
});

prevBtn.addEventListener('click', () => changePage(-1));
nextBtn.addEventListener('click', () => changePage(1));

function changePage(offset) {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page')) || 1;
    params.set('page', page + offset);
    history.pushState(null, '', `?${params.toString()}`);
    render();
}

clearBtn.addEventListener('click', () => {
    searchInput.value = '';
    categorySelect.value = '';
    ratingSelect.value = 0;
    priceRange.value = 1000;
    priceValue.textContent = '$1000';

    history.pushState(null, '', location.pathname);
    render();
});

/* =====================================================
   7. INIT
===================================================== */
window.addEventListener('popstate', render);
render();

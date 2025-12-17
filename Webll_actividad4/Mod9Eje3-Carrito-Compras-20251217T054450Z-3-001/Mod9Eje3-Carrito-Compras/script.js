// ===============================
// BASE DE DATOS DE PRODUCTOS
// ===============================
const products = [
    {
        id: 1,
        name: 'Laptop Pro',
        price: 12999,
        description: 'Laptop de alto rendimiento',
        emoji: '💻',
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
        stock: 5
    },
    {
        id: 2,
        name: 'Smartphone',
        price: 8999,
        description: 'Teléfono inteligente de última generación',
        emoji: '📱',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
        stock: 10
    },
    {
        id: 3,
        name: 'Auriculares',
        price: 2499,
        description: 'Auriculares inalámbricos con cancelación de ruido',
        emoji: '🎧',
        image: 'https://img.freepik.com/foto-gratis/vida-muerta-auriculares-ciberneticos-inalambricos_23-2151072201.jpg?semt=ais_hybrid&w=740&q=80',
        stock: 15
    },
    {
        id: 4,
        name: 'Tablet',
        price: 6999,
        description: 'Tablet de 10 pulgadas',
        emoji: '📱',
        image: 'https://ae01.alicdn.com/kf/S8bd6fbb57ac64e9fa32b40110df06dc9n/2023-Global-Version-Tablet-Android-12-12GB-RAM-512GB-ROM-11-Inch-HD-4K-Screen-Tablet.jpg',
        stock: 8
    },
    {
        id: 5,
        name: 'Smartwatch',
        price: 4999,
        description: 'Reloj inteligente con GPS',
        emoji: '⌚',
        image: 'https://www.shutterstock.com/shutterstock/videos/1101468223/thumb/1.jpg?ip=x480',
        stock: 12
    },
    {
        id: 6,
        name: 'Cámara',
        price: 15999,
        description: 'Cámara profesional 4K',
        emoji: '📷',
        image: 'https://media.gettyimages.com/id/1452644434/es/foto/cinema-camera-telephoto-film-set-still-on-the-tripod.jpg?s=612x612&w=gi&k=20&c=C9q3oqcOcOn9vA7ev-7wlnCW5oywbxvx0WH6SSs0ThQ=',
        stock: 3
    }
];

// ===============================
// VARIABLES GLOBALES
// ===============================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartSummary = document.getElementById('cartSummary');
const subtotal = document.getElementById('subtotal');
const tax = document.getElementById('tax');
const shipping = document.getElementById('shipping');
const total = document.getElementById('total');
const checkoutBtn = document.getElementById('checkoutBtn');
const clearCartBtn = document.getElementById('clearCartBtn');
const confirmModal = document.getElementById('confirmModal');
const orderTotal = document.getElementById('orderTotal');

const SHIPPING_COST = 50;
const TAX_RATE = 0.16;

// ===============================
// RENDER PRODUCTOS
// ===============================
function renderProducts() {
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const stockClass = product.stock < 5 ? 'low' : '';
        const stockText = product.stock < 5
            ? `¡Solo ${product.stock} disponibles!`
            : `${product.stock} disponibles`;

        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <p class="product-price">$${product.price.toLocaleString()}</p>
                <p class="product-stock ${stockClass}">${stockText}</p>
                <button class="btn-add-cart"
                    onclick="addToCart(${product.id})"
                    ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Agotado' : 'Añadir al Carrito'}
                </button>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

// ===============================
// AÑADIR AL CARRITO
// ===============================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock === 0) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        if (existingItem.quantity >= product.stock) {
            alert(`No hay más stock de ${product.name}`);
            return;
        }
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    updateCartCount();

    cartCount.style.transform = 'scale(1.3)';
    setTimeout(() => cartCount.style.transform = 'scale(1)', 300);
}

// ===============================
// RENDER CARRITO
// ===============================
function renderCart() {
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartSummary.style.display = 'none';
        return;
    }

    cartItems.innerHTML = '';
    cartSummary.style.display = 'block';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toLocaleString()}</div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="decreaseQuantity(${item.id})">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
                    <button class="btn-remove" onclick="removeFromCart(${item.id})">Eliminar</button>
                </div>
            </div>
        `;

        cartItems.appendChild(cartItem);
    });

    updateTotals();
}

// ===============================
// CONTROL DE CANTIDAD
// ===============================
function increaseQuantity(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem.quantity >= product.stock) {
        alert(`No hay más stock de ${product.name}`);
        return;
    }

    cartItem.quantity++;
    saveCart();
    renderCart();
}

function decreaseQuantity(productId) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem.quantity > 1) {
        cartItem.quantity--;
    } else {
        removeFromCart(productId);
        return;
    }

    saveCart();
    renderCart();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCart();
    updateCartCount();
}

// ===============================
// TOTALES
// ===============================
function updateTotals() {
    const subtotalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const taxAmount = subtotalAmount * TAX_RATE;
    const shippingAmount = cart.length > 0 ? SHIPPING_COST : 0;
    const totalAmount = subtotalAmount + taxAmount + shippingAmount;

    subtotal.textContent = `$${subtotalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    tax.textContent = `$${taxAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    shipping.textContent = `$${shippingAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    total.textContent = `$${totalAmount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
}

// ===============================
// UTILIDADES
// ===============================
function updateCartCount() {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function clearCart() {
    if (cart.length === 0) return;
    if (confirm('¿Vaciar el carrito?')) {
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
    }
}

function checkout() {
    if (cart.length === 0) return;

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const finalTotal = totalAmount + (totalAmount * TAX_RATE) + SHIPPING_COST;

    orderTotal.textContent = `$${finalTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}`;
    confirmModal.classList.add('active');

    setTimeout(() => {
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
    }, 500);
}

function closeModal() {
    confirmModal.classList.remove('active');
}

// ===============================
// EVENTOS
// ===============================
checkoutBtn.addEventListener('click', checkout);
clearCartBtn.addEventListener('click', clearCart);
confirmModal.querySelector('.modal-overlay').addEventListener('click', closeModal);

// ===============================
// INICIALIZAR
// ===============================
renderProducts();
renderCart();
updateCartCount();

console.log('🛒 Carrito inicializado correctamente');

const products = [
  {id: 1, name: "1.000 V-Bucks", description: "Perfectos para comprar el Pase de Batalla o skins básicos", price: 5000, image: "img/pavos1.png", popular: false},
  {id: 2, name: "2.800 V-Bucks", description: "Incluye 300 V-Bucks de bonificación. Ideal para varios items", price: 12000, image: "img/pavos2.png", popular: true},
  {id: 3, name: "5.000 V-Bucks", description: "Incluye 1.000 V-Bucks de bonificación. Perfecto para coleccionar", price: 19000, image: "img/pavos3.png", popular: false},
  {id: 4, name: "13.500 V-Bucks", description: "Incluye 3.500 V-Bucks de bonificación. Máximo valor", price: 37000, image: "img/pavos4.png", popular: false},
  {id: 5, name: "Fortnite Crew", description: "Suscripción mensual con V-Bucks, Pase de Batalla y skin exclusiva", price: 3000, image: "img/crew1.png", popular: true},
  {id: 6, name: "Starter Pack", description: "Pack inicial con V-Bucks y skin exclusiva del pack", price: 6000, image: "img/rev.png", popular: false}
];

let cart = [], cartCount = 0;
const els = {
  cartIcon: document.getElementById('cartIcon'),
  cartSidebar: document.getElementById('cartSidebar'),
  cartOverlay: document.getElementById('cartOverlay'),
  closeCart: document.getElementById('closeCart'),
  cartContent: document.getElementById('cartContent'),
  cartCount: document.getElementById('cartCount'),
  productsGrid: document.getElementById('productsGrid'),
  navbar: document.getElementById('navbar')
};

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
  
  window.addEventListener('scroll', () => {
    els.navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
});

function renderProducts() {
  els.productsGrid.innerHTML = products.map(p => `
    <div class="product-card animate-slide-up">
      ${p.popular ? '<div class="popular-badge">🔥 Popular</div>' : ''}
      <div class="product-image">
        <img src="${p.image}" alt="${p.name}" loading="lazy">
      </div>
      <h3 class="product-title">${p.name}</h3>
      <p class="product-description">${p.description}</p>
      <div class="product-price">$${p.price.toLocaleString()} ARS</div>
      <div class="product-actions">
        <div class="quantity-selector">
          <button class="quantity-btn" onclick="changeQuantity(${p.id}, -1)">-</button>
          <input type="number" class="quantity-input" id="qty-${p.id}" value="1" min="1" max="10">
          <button class="quantity-btn" onclick="changeQuantity(${p.id}, 1)">+</button>
        </div>
        <button class="add-to-cart" onclick="addToCart(${p.id})">
          <i class="fas fa-cart-plus"></i> Agregar
        </button>
      </div>
    </div>
  `).join('');
}

function changeQuantity(id, change) {
  const input = document.getElementById(`qty-${id}`);
  const newValue = parseInt(input.value) + change;
  if (newValue >= 1 && newValue <= 10) input.value = newValue;
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const quantity = parseInt(document.getElementById(`qty-${id}`).value);
  const existing = cart.find(item => item.id === id);
  
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({...product, quantity});
  }
  
  updateCartUI();
  showNotification(`${product.name} agregado al carrito`);
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCartUI();
  showNotification('Producto eliminado del carrito');
}

function updateCartQuantity(id, newQuantity) {
  if (newQuantity <= 0) {
    removeFromCart(id);
    return;
  }
  
  const item = cart.find(item => item.id === id);
  if (item) {
    item.quantity = newQuantity;
    updateCartUI();
  }
}

function updateCartUI() {
  cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  els.cartCount.textContent = cartCount;

  if (cart.length === 0) {
    els.cartContent.innerHTML = '<div class="empty-cart"><i class="fas fa-shopping-cart"></i><p>Tu carrito está vacío</p></div>';
    return;
  }

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  els.cartContent.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => `
        <div class="cart-item">
          <div class="cart-item-details">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">${item.price.toLocaleString()} ARS</div>
            <div class="cart-item-quantity">
              <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
              <span style="margin: 0 0.5rem; font-weight: 600;">${item.quantity}</span>
              <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
              <button class="quantity-btn" onclick="removeFromCart(${item.id})" style="margin-left: 1rem; color: #ef4444;">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    <div class="cart-summary">
      <div class="cart-total">Total: ${total.toLocaleString()} ARS</div>
      <button class="checkout-btn" onclick="checkout()">
        <i class="fas fa-credit-card"></i> Proceder al Pago
      </button>
    </div>
  `;
}

function showNotification(message) {
  const n = document.createElement('div');
  n.style.cssText = `position: fixed; top: 100px; right: 20px; background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 1rem 1.5rem; border-radius: 12px; box-shadow: 0 8px 25px rgba(16, 185, 129, 0.3); z-index: 1002; animation: slideInRight 0.3s ease forwards; font-weight: 600;`;
  n.innerHTML = `<i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>${message}`;
  document.body.appendChild(n);
  
  setTimeout(() => {
    n.style.animation = 'slideOutRight 0.3s ease forwards';
    setTimeout(() => document.body.removeChild(n), 300);
  }, 3000);
}

function checkout() {
  if (cart.length === 0) {
    showNotification('Tu carrito está vacío');
    return;
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const items = cart.map(item => `${item.name} x${item.quantity}`).join(', ');
  const btn = document.querySelector('.checkout-btn');
  const originalText = btn.innerHTML;
  
  btn.innerHTML = '<div class="loading"></div> Procesando...';
  btn.disabled = true;
  
  setTimeout(() => {
    window.open('https://discord.gg/wu95NHjfAN', '_blank');
    btn.innerHTML = originalText;
    btn.disabled = false;
    showNotification('Redirigiendo a Discord para completar la compra');
  }, 2000);
}

// Event listeners
els.cartIcon.addEventListener('click', () => {
  els.cartSidebar.classList.add('open');
  els.cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
});

[els.closeCart, els.cartOverlay].forEach(el => {
  el.addEventListener('click', () => {
    els.cartSidebar.classList.remove('open');
    els.cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  });
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && els.cartSidebar.classList.contains('open')) {
    els.cartSidebar.classList.remove('open');
    els.cartOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  }
});

// Add CSS styles
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes slideOutRight { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
  .popular-badge { position: absolute; top: 15px; right: 15px; background: linear-gradient(135deg, #f59e0b, #d97706); color: white; padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; z-index: 2; animation: pulse 2s infinite; }
  @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.05); } 100% { transform: scale(1); } }
  .cart-items { max-height: 400px; overflow-y: auto; margin-bottom: 2rem; }
  .cart-items::-webkit-scrollbar { width: 6px; }
  .cart-items::-webkit-scrollbar-track { background: rgba(59, 130, 246, 0.1); border-radius: 3px; }
  .cart-items::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.5); border-radius: 3px; }
  .checkout-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
  .quantity-input::-webkit-outer-spin-button, .quantity-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .quantity-input[type=number] { -moz-appearance: textfield; }
  .product-card { position: relative; }
  .animate-slide-up { opacity: 0; animation: slideInUp 0.6s ease forwards; }
  .animate-slide-up:nth-child(1) { animation-delay: 0.1s; }
  .animate-slide-up:nth-child(2) { animation-delay: 0.2s; }
  .animate-slide-up:nth-child(3) { animation-delay: 0.3s; }
  .animate-slide-up:nth-child(4) { animation-delay: 0.4s; }
  .animate-slide-up:nth-child(5) { animation-delay: 0.5s; }
  .animate-slide-up:nth-child(6) { animation-delay: 0.6s; }
  @media (max-width: 768px) {
    .product-actions { flex-direction: column; gap: 1rem; }
    .quantity-selector { justify-content: center; }
  }
`;
document.head.appendChild(style);

// Mobile menu toggle
const mobileBtn = document.createElement('button');
mobileBtn.className = 'mobile-menu-toggle';
mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
mobileBtn.style.cssText = 'display: none; background: none; border: none; color: white; font-size: 1.5rem; cursor: pointer;';
mobileBtn.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('open');
});

const navLinks = document.querySelector('.nav-links');
if (navLinks) navLinks.parentNode.insertBefore(mobileBtn, navLinks);

// Mobile responsive styles
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
  @media (max-width: 768px) {
    .mobile-menu-toggle { display: block !important; }
    .nav-links { position: absolute; top: 100%; left: 0; right: 0; background: rgba(20, 24, 35, 0.98); backdrop-filter: blur(20px); flex-direction: column; padding: 2rem; transform: translateY(-100%); opacity: 0; visibility: hidden; transition: all 0.3s ease; }
    .nav-links.open { transform: translateY(0); opacity: 1; visibility: visible; }
  }
`;
document.head.appendChild(mobileStyles);

// Intersection Observer for animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.style.animationPlayState = 'running';
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.product-card').forEach(card => observer.observe(card));
if (typeof gsap !== 'undefined') {
  gsap.from('.hero-content > *', {
    duration: 1,
    y: 50,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
  });
}
const CART_KEY = 'cart_items';

function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === Number(productId));
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: Number(productId), quantity: 1 });
  }
  saveCart(cart);
  updateCartCount();
  alert('Izdelek je bil dodan v košarico.');
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter((i) => i.id !== Number(productId));
  saveCart(cart);
  updateCartCount();
}

function changeQuantity(productId, qty) {
  const cart = getCart();
  const item = cart.find((i) => i.id === Number(productId));
  const parsed = Math.max(1, Number(qty) || 1);
  if (item) {
    item.quantity = parsed;
    saveCart(cart);
  }
}

function updateCartCount() {
  const cart = getCart();
  const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartCountEl = document.getElementById('cart-count');
  if (cartCountEl) {
    cartCountEl.textContent = totalItems;
  }
}

document.addEventListener('DOMContentLoaded', updateCartCount);

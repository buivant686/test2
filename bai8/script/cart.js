
// Key used to store cart data in localStorage
const STORAGE_KEY = "lune_cart_v1";

// ── Cart state ──────────────────────────────────────
// Each entry looks like: { id: 3, quantity: 2 }
let cartItems = loadCartFromStorage();

/** Load saved cart from localStorage. Returns empty array if nothing saved. */
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    // If JSON is broken, start fresh
    return [];
  }
}

/** Save the current cart to localStorage so it persists on reload. */
function saveCartToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
}

/** Wipe cart from localStorage. */
function clearCartFromStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
/**
 * Add one unit of a product to the cart.
 * If already in cart, increases quantity by 1.
 * @param {number} productId
 */
function addToCart(productId) {
  const existing = cartItems.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cartItems.push({ id: productId, quantity: 1 });
  }

  saveCartToStorage();
}

/**
 * Increase quantity of a cart item by 1.
 * @param {number} productId
 */
function increaseQuantity(productId) {
  const item = cartItems.find((item) => item.id === productId);
  if (item) {
    item.quantity += 1;
    saveCartToStorage();
  }
}

/**
 * Decrease quantity by 1. Removes item if quantity reaches 0.
 * @param {number} productId
 */
function decreaseQuantity(productId) {
  const index = cartItems.findIndex((item) => item.id === productId);
  if (index === -1) return;

  if (cartItems[index].quantity > 1) {
    cartItems[index].quantity -= 1;
  } else {
    // Remove from array when quantity hits 0
    cartItems.splice(index, 1);
  }

  saveCartToStorage();
}

/**
 * Remove a product completely from the cart.
 * @param {number} productId
 */
function removeFromCart(productId) {
  cartItems = cartItems.filter((item) => item.id !== productId);
  saveCartToStorage();
}

/** Remove all items from the cart. */
function clearCart() {
  cartItems = [];
  clearCartFromStorage();
}

/** Returns the full array of cart items. */
function getCartItems() {
  return cartItems;
}

/**
 * Total number of items in cart (sum of all quantities).
 * @returns {number}
 */
function getCartCount() {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Total price of all items in cart.
 * @returns {number}
 */
function getCartTotal() {
  return cartItems.reduce((sum, item) => {
    const product = PRODUCTS.find((p) => p.id === item.id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);
}
/**
 * js/render.js
 * ──────────────────────────────────────────────────
 * All DOM rendering functions live here.
 * These functions READ state and BUILD the UI.
 * They never modify state themselves.
 * ──────────────────────────────────────────────────
 */


// ── Helpers ─────────────────────────────────────────

/**
 * Format a number as a price string, e.g. 72 → "$72"
 * @param {number} amount
 * @returns {string}
 */
function formatPrice(amount) {
  return `$${amount % 1 === 0 ? amount : amount.toFixed(2)}`;
}

/**
 * Build a star rating row (★★★★☆ style).
 * @param {number} rating  - number from 1 to 5
 * @param {number} reviews - total review count
 * @returns {string} HTML string
 */
function buildStarsHTML(rating, reviews) {
  let starsHTML = '<div class="stars">';
  for (let i = 1; i <= 5; i++) {
    starsHTML += `<span class="star ${i <= rating ? "" : "empty"}">★</span>`;
  }
  starsHTML += "</div>";
  return `
    <div class="product-card__rating">
      ${starsHTML}
      <span class="rating-count">(${reviews})</span>
    </div>
  `;
}


// ── Product Grid ────────────────────────────────────

/**
 * Build and return a single <li> product card element.
 * @param {Object} product
 * @returns {HTMLLIElement}
 */
function createProductCard(product) {
  const li = document.createElement("li");
  li.className = "product-card";
  li.dataset.productId = product.id;

  li.innerHTML = `
    <div class="product-card__image-wrap">
      <img
        src="${product.image}"
        alt="${product.name}"
        class="product-card__image"
        loading="lazy"
      />
      <span class="product-card__badge">${product.category}</span>
      <button class="product-card__wishlist" aria-label="Wishlist ${product.name}">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      </button>
    </div>

    <div class="product-card__info">
      <h2 class="product-card__name">${product.name}</h2>
      <p class="product-card__desc">${product.description}</p>
      ${buildStarsHTML(product.rating, product.reviews)}

      <div class="product-card__footer">
        <span class="product-card__price">${formatPrice(product.price)}</span>
        <button class="btn-add-cart" data-id="${product.id}" aria-label="Add ${product.name} to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add
        </button>
      </div>
    </div>
  `;

  return li;
}

/**
 * Re-render the entire product grid based on current filters.
 * Also updates the product count label and empty state.
 */
function renderProductGrid() {
  const grid = document.getElementById("productGrid");
  const emptyState = document.getElementById("emptyState");
  const countLabel = document.getElementById("productCount");

  const products = getFilteredProducts();

  // Clear existing cards
  grid.innerHTML = "";

  if (products.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;

    // Build all cards and add to DOM at once (better performance)
    const fragment = document.createDocumentFragment();
    products.forEach((product) => {
      fragment.appendChild(createProductCard(product));
    });
    grid.appendChild(fragment);
  }

  // Update count label
  countLabel.textContent = `${products.length} product${products.length !== 1 ? "s" : ""}`;
}


// ── Cart Badge (header count) ───────────────────────

/**
 * Update the cart item count badge in the header.
 */
function renderCartBadge() {
  const badge = document.getElementById("cartBadge");
  const count = getCartCount();

  badge.textContent = count;

  // Toggle .hidden class — CSS will fade/scale it out
  if (count === 0) {
    badge.classList.add("hidden");
  } else {
    badge.classList.remove("hidden");
  }
}


// ── Cart Sidebar ────────────────────────────────────

/**
 * Build and return a single cart item <li> element.
 * @param {Object} entry - { id, quantity }
 * @returns {HTMLLIElement|null}
 */
function createCartItemEl(entry) {
  const product = PRODUCTS.find((p) => p.id === entry.id);
  if (!product) return null;

  const li = document.createElement("li");
  li.className = "cart-item";
  li.dataset.cartId = entry.id;

  li.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="cart-item__image" loading="lazy" />

    <div class="cart-item__details">
      <p class="cart-item__name">${product.name}</p>
      <p class="cart-item__price-line">${formatPrice(product.price)} each</p>

      <div class="cart-item__qty">
        <button class="qty-btn qty-decrease" data-id="${entry.id}" aria-label="Decrease quantity">−</button>
        <span class="qty-num">${entry.quantity}</span>
        <button class="qty-btn qty-increase" data-id="${entry.id}" aria-label="Increase quantity">+</button>
      </div>
    </div>

    <button class="cart-item__remove" data-id="${entry.id}" aria-label="Remove ${product.name}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14H6L5 6"/>
        <path d="M10 11v6"/><path d="M14 11v6"/>
        <path d="M9 6V4h6v2"/>
      </svg>
    </button>
  `;

  return li;
}

/**
 * Re-render the entire cart sidebar.
 * Updates: item list, total price, badge.
 */
function renderCart() {
  const cartList = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  const items = getCartItems();

  // Clear and rebuild list
  cartList.innerHTML = "";

  if (items.length === 0) {
    // Show empty cart message
    cartList.innerHTML = `
      <li class="cart-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        <p>Your cart is empty.</p>
      </li>
    `;
  } else {
    const fragment = document.createDocumentFragment();
    items.forEach((entry) => {
      const el = createCartItemEl(entry);
      if (el) fragment.appendChild(el);
    });
    cartList.appendChild(fragment);
  }

  // Update total and badge
  totalEl.textContent = formatPrice(getCartTotal());
  renderCartBadge();
}


// ── Toast Notification ──────────────────────────────

let toastTimer = null;

/**
 * Show a short-lived message at the bottom of the screen.
 * @param {string} message
 */
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  // Auto-hide after 2.5 seconds
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2500);
}
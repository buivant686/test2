/**
 * js/main.js
 * ──────────────────────────────────────────────────
 * Entry point of the app.
 * Responsibilities:
 *  - Bind all event listeners
 *  - Call render functions when state changes
 *  - Open / close cart sidebar
 *
 * Depends on: data.js, cart.js, filter.js, render.js
 * (loaded before this file via <script> tags in HTML)
 * ──────────────────────────────────────────────────
 */


// ── Cart Sidebar: Open & Close ──────────────────────

/** Open the cart sidebar and lock page scrolling */
function openCart() {
  document.getElementById("cartSidebar").hidden = false;
  document.getElementById("overlay").hidden = false;
  document.getElementById("cartButton").setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden"; // prevent background scroll
  renderCart(); // re-render cart contents each time it opens
}

/** Close the cart sidebar and restore page scrolling */
function closeCart() {
  document.getElementById("cartSidebar").hidden = true;
  document.getElementById("overlay").hidden = true;
  document.getElementById("cartButton").setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";
}


// ── Event Handlers ──────────────────────────────────

/** Category pill clicked — filter by that category */
function onCategoryClick(event) {
  const pill = event.target.closest(".category-pill");
  if (!pill) return;

  // Remove .active from all pills, add to clicked one
  document.querySelectorAll(".category-pill").forEach((p) => p.classList.remove("active"));
  pill.classList.add("active");

  setCategory(pill.dataset.category);
  renderProductGrid();
}

/** Price range slider moved */
function onPriceChange(event) {
  const value = Number(event.target.value);
  setMaxPrice(value);
  document.getElementById("priceDisplay").textContent = `$${value}`;
  renderProductGrid();
}

/** Sort dropdown changed */
function onSortChange(event) {
  setSortOrder(event.target.value);
  renderProductGrid();
}

/** Search input typed — debounced so it doesn't fire on every keystroke */
let searchDebounceTimer = null;
function onSearchInput(event) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => {
    setSearchQuery(event.target.value);
    renderProductGrid();
  }, 250); // wait 250ms after user stops typing
}

/**
 * "Add to Cart" button clicked on a product card.
 * Uses event delegation on the grid — one listener for all cards.
 */
function onAddToCart(event) {
  const btn = event.target.closest(".btn-add-cart");
  if (!btn) return;

  const productId = Number(btn.dataset.id);
  const product = PRODUCTS.find((p) => p.id === productId);
  if (!product) return;

  addToCart(productId);
  renderCartBadge(); // update badge count immediately

  // Visual feedback: briefly change button text
  btn.textContent = "✓ Added";
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="14" height="14">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Add
    `;
    btn.disabled = false;
  }, 1000);

  showToast(`"${product.name}" added to cart`);
}

/**
 * Quantity / remove buttons inside the cart sidebar.
 * Uses event delegation on the cart list.
 */
function onCartAction(event) {
  // Increase quantity
  const increaseBtn = event.target.closest(".qty-increase");
  if (increaseBtn) {
    increaseQuantity(Number(increaseBtn.dataset.id));
    renderCart();
    return;
  }

  // Decrease quantity
  const decreaseBtn = event.target.closest(".qty-decrease");
  if (decreaseBtn) {
    decreaseQuantity(Number(decreaseBtn.dataset.id));
    renderCart();
    return;
  }

  // Remove item
  const removeBtn = event.target.closest(".cart-item__remove");
  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    const product = PRODUCTS.find((p) => p.id === id);
    removeFromCart(id);
    renderCart();
    if (product) showToast(`"${product.name}" removed`);
  }
}

/** "Clear Cart" button clicked */
function onClearCart() {
  clearCart();
  renderCart();
  showToast("Cart cleared");
}

/** "Checkout" button clicked (stub — no backend) */
function onCheckout() {
  showToast("Checkout is not set up yet!");
}

/** Close cart when Escape key is pressed */
function onKeyDown(event) {
  if (event.key === "Escape") closeCart();
}


// ── Initialise App ──────────────────────────────────

function init() {
  // Set price slider max to highest product price
  const priceRange = document.getElementById("priceRange");
  priceRange.max = MAX_PRICE;
  priceRange.value = MAX_PRICE;
  document.getElementById("priceDisplay").textContent = `$${MAX_PRICE}`;

  // First render
  renderProductGrid();
  renderCartBadge();

  // ── Bind events ──

  // Header
  document.getElementById("cartButton").addEventListener("click", openCart);
  document.getElementById("searchInput").addEventListener("input", onSearchInput);

  // Categories
  document.querySelector(".categories__container").addEventListener("click", onCategoryClick);

  // Toolbar
  priceRange.addEventListener("input", onPriceChange);
  document.getElementById("sortSelect").addEventListener("change", onSortChange);

  // Product grid — event delegation for "Add to Cart" buttons
  document.getElementById("productGrid").addEventListener("click", onAddToCart);

  // Cart sidebar
  document.getElementById("cartCloseBtn").addEventListener("click", closeCart);
  document.getElementById("overlay").addEventListener("click", closeCart);
  document.getElementById("cartItems").addEventListener("click", onCartAction);
  document.getElementById("clearCartBtn").addEventListener("click", onClearCart);
  document.getElementById("checkoutBtn").addEventListener("click", onCheckout);

  // Keyboard
  document.addEventListener("keydown", onKeyDown);
}

// Run init when the page has loaded
document.addEventListener("DOMContentLoaded", init);
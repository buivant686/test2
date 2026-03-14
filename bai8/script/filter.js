
let activeCategory = "all";    
let activeMaxPrice = MAX_PRICE; 
let activeSortOrder = "default";
let activeSearch = "";         




function setCategory(category) {
  activeCategory = category;
}

function setMaxPrice(price) {
  activeMaxPrice = price;
}

function setSortOrder(order) {
  activeSortOrder = order;
}

function setSearchQuery(query) {
  activeSearch = query.toLowerCase().trim();
}


// ── Main filter function ────────────────────────────

/**
 * Apply all active filters + sort to the PRODUCTS array.
 * Returns a new filtered & sorted array, ready to render.
 * @returns {Array}
 */
function getFilteredProducts() {
  // Step 1: Start with all products
  let result = [...PRODUCTS];

  // Step 2: Filter by category
  if (activeCategory !== "all") {
    result = result.filter((p) => p.category === activeCategory);
  }

  // Step 3: Filter by max price
  result = result.filter((p) => p.price <= activeMaxPrice);

  // Step 4: Filter by search keyword (name or description)
  if (activeSearch) {
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(activeSearch) ||
        p.description.toLowerCase().includes(activeSearch) ||
        p.category.toLowerCase().includes(activeSearch)
    );
  }

  // Step 5: Sort
  if (activeSortOrder === "price-asc") {
    result.sort((a, b) => a.price - b.price);
  } else if (activeSortOrder === "price-desc") {
    result.sort((a, b) => b.price - a.price);
  } else if (activeSortOrder === "name-asc") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }
  // "default" → keep original catalogue order

  return result;
}
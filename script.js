const products = [
  { id: 1, name: "Everyday Cotton Shirt", category: "Tops", price: 899, fabric: "100% cotton", color: "#b8c2a4" },
  { id: 2, name: "Relaxed Linen Top", category: "Tops", price: 1099, fabric: "Linen blend", color: "#d4b49b" },
  { id: 3, name: "Classic Straight Trousers", category: "Bottoms", price: 1299, fabric: "Cotton twill", color: "#a7b5c2" },
  { id: 4, name: "Everyday Denim", category: "Bottoms", price: 1499, fabric: "Denim cotton", color: "#8799ad" },
  { id: 5, name: "Soft Cotton Scarf", category: "Textiles", price: 499, fabric: "Soft cotton", color: "#c9a1a1" },
  { id: 6, name: "Woven Cushion Cover", category: "Textiles", price: 649, fabric: "Handfeel woven blend", color: "#c6b88a" },
  { id: 7, name: "Weekend Overshirt", category: "Tops", price: 1199, fabric: "Brushed cotton", color: "#9eab8d" },
  { id: 8, name: "Easy Fit Shorts", category: "Bottoms", price: 799, fabric: "Cotton blend", color: "#d5c8b9" }
];

let cart = [];
const productGrid = document.getElementById("product-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const resultCount = document.getElementById("result-count");
const cartPanel = document.getElementById("cart-panel");
const overlay = document.getElementById("overlay");

function money(value) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function renderProducts() {
  const search = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;
  const visibleProducts = products.filter(product => {
    const matchesSearch = `${product.name} ${product.category} ${product.fabric}`.toLowerCase().includes(search);
    const matchesCategory = category === "all" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  resultCount.textContent = `${visibleProducts.length} product${visibleProducts.length === 1 ? "" : "s"} found`;
  productGrid.innerHTML = "";

  if (visibleProducts.length === 0) {
    productGrid.innerHTML = '<p>No products found. Try another search or category.</p>';
    return;
  }

  visibleProducts.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-art" style="--product-color:${product.color}">
        <span>THREAD & LOOM</span>
      </div>
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3>${product.name}</h3>
        <p>${product.fabric}</p>
        <div class="product-bottom">
          <span class="product-price">${money(product.price)}</span>
          <button class="add-button" data-add="${product.id}">Add to cart</button>
        </div>
      </div>`;
    productGrid.appendChild(card);
  });
}

function renderCart() {
  document.getElementById("cart-count").textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartItems = document.getElementById("cart-items");
  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty. Add something you like!</p>";
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div><strong>${item.name}</strong><p>${money(item.price)} × ${item.quantity}</p></div>
      <div><strong>${money(item.price * item.quantity)}</strong><br>
      <button class="remove-button" data-remove="${item.id}">Remove one</button></div>`;
    cartItems.appendChild(row);
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-total").textContent = money(total);
}

function openCart() {
  cartPanel.hidden = false;
  overlay.hidden = false;
}
function closeCart() {
  cartPanel.hidden = true;
  overlay.hidden = true;
}

productGrid.addEventListener("click", event => {
  const id = Number(event.target.dataset.add);
  if (!id) return;
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ ...product, quantity: 1 });
  renderCart();
  document.getElementById("checkout-message").textContent = "";
});

document.getElementById("cart-items").addEventListener("click", event => {
  const id = Number(event.target.dataset.remove);
  if (!id) return;
  const item = cart.find(product => product.id === id);
  if (item.quantity > 1) item.quantity -= 1;
  else cart = cart.filter(product => product.id !== id);
  renderCart();
});

searchInput.addEventListener("input", renderProducts);
categoryFilter.addEventListener("change", renderProducts);
document.getElementById("cart-toggle").addEventListener("click", openCart);
document.getElementById("cart-close").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

document.getElementById("checkout-button").addEventListener("click", () => {
  const message = document.getElementById("checkout-message");
  message.textContent = cart.length
    ? "Demo checkout only. Connect a secure backend and payment provider before accepting real orders."
    : "Your cart is empty. Add a product before checkout.";
});

document.getElementById("newsletter-form").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("newsletter-message").textContent = "Thanks! This demo form does not save or send your email.";
  event.target.reset();
});

document.getElementById("year").textContent = new Date().getFullYear();
renderProducts();
renderCart();

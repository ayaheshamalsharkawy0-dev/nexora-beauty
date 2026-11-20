const products = [
    {
        id: 1,
        name: "Velvet Matte Foundation",
        category: "face",
        price: 34.00,
        image: "images/foundation.jpg",
        description: "Weightless liquid coverage with a smooth, natural satin-matte finish."
    },
    {
        id: 2,
        name: "Terracotta Silk Blush",
        category: "face",
        price: 24.00,
        image: "images/blush.jpg",
        description: "Finely milled warm terracotta powder that blends seamlessly onto cheeks."
    },
    {
        id: 3,
        name: "Luminous Sculpt Concealer",
        category: "face",
        price: 22.00,
        image: "images/concealer.jpg",
        description: "Crease-resistant brightening concealer for a fresh, lifted look."
    },
    {
        id: 4,
        name: "Caramel Suede Lipstick",
        category: "lips",
        price: 20.00,
        image: "images/lipstick.jpg",
        description: "Richly pigmented warm nude lipstick with a comfortable velvety glide."
    },
    {
        id: 5,
        name: "Champagne Shine Lip Gloss",
        category: "lips",
        price: 18.00,
        image: "images/lipgloss.jpg",
        description: "Non-sticky hydrating gloss with subtle golden shimmer for glass-like shine."
    },
    {
        id: 6,
        name: "Espresso Lash Lift Mascara",
        category: "eyes",
        price: 21.00,
        image: "images/mascara.jpg",
        description: "Buildable lengthening and volumizing mascara for defined, fluttery lashes."
    },
    {
        id: 7,
        name: "Golden Dune Eyeshadow Palette",
        category: "eyes",
        price: 42.00,
        image: "images/eyeshadow.jpg",
        description: "Curated warm bronzes, soft mattes, and shimmering golds for day-to-night looks."
    },
    {
        id: 8,
        name: "Warm Bronze Brush & Puff Set",
        category: "tools",
        price: 38.00,
        image: "images/brushes.jpg",
        description: "Ultra-soft synthetic brushes and plush puffs for effortless blending."
    }
];

let cart = [];

const productsGrid = document.getElementById("products-grid");
const filterButtons = document.querySelectorAll(".filter-btn");
const cartCountEl = document.getElementById("cart-count");
const cartItemsEl = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const openCartBtn = document.getElementById("open-cart");
const closeCartBtn = document.getElementById("close-cart");
const checkoutBtn = document.getElementById("checkout-btn");
const toastEl = document.getElementById("toast");

function renderProducts(category = "all") {
    const filtered = category === "all"
        ? products
        : products.filter(item => item.category === category);

    productsGrid.innerHTML = filtered.map(product => `
        <article class="product-card">
            <div class="product-img-box">
                <span class="category-tag">${product.category}</span>
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                <div class="product-bottom">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-btn" onclick="addToCart(${product.id})">Add to Bag</button>
                </div>
            </div>
        </article>
    `).join("");
}

filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderProducts(btn.dataset.category);
    });
});

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    updateCartUI();
    showToast(`${product.name} added to bag`);
}

function updateQty(productId, change) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== productId);
    }
    updateCartUI();
}

function removeItem(productId) {
    cart = cart.filter(i => i.id !== productId);
    updateCartUI();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    cartCountEl.textContent = totalCount;
    cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

    if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="empty-msg">Your bag is currently empty.</p>`;
        return;
    }

    cartItemsEl.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <span>$${(item.price * item.qty).toFixed(2)}</span>
                <div class="qty-controls">
                    <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
                </div>
            </div>
        </div>
    `).join("");
}

function openCart() {
    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");
}

function closeCart() {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
}

openCartBtn.addEventListener("click", openCart);
closeCartBtn.addEventListener("click", closeCart);
cartOverlay.addEventListener("click", closeCart);

checkoutBtn.addEventListener("click", () => {
    if (cart.length === 0) {
        showToast("Your bag is empty!");
        return;
    }
    showToast("Thank you for shopping with NEXORA Beauty!");
    cart = [];
    updateCartUI();
    closeCart();
});

function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => {
        toastEl.classList.remove("show");
    }, 2500);
}

renderProducts();
updateCartUI();
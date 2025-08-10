// script.js - Versão Aprimorada
let cart = [];
let currentUser = null;

// Produtos
const products = [
    { id: 1, name: "Starter Pack", price: 19.90, coins: 1000, bonus: "Skin exclusiva" },
    { id: 2, name: "Pro Pack", price: 49.90, coins: 3000, bonus: "Veículo exclusivo" },
    { id: 3, name: "Premium Pack", price: 89.90, coins: 7000, bonus: "Veículo + Skin + Casa VIP" },
    { id: 4, name: "Ultimate Pack", price: 149.90, coins: 15000, bonus: "Super Carro + Membro VIP" }
];

// Carregar tema salvo
document.documentElement.setAttribute("data-theme", localStorage.getItem("theme") || "dark");

// Botão de tema
function addThemeToggle() {
    const body = document.querySelector("body");
    const toggle = document.createElement("button");
    toggle.innerHTML = "🌓";
    toggle.className = "theme-toggle";
    toggle.title = "Alternar tema claro/escuro";
    toggle.onclick = toggleTheme;
    body.appendChild(toggle);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const newTheme = current === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
}

// Notificação
function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.classList.add("show"), 100);
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => document.body.removeChild(toast), 300);
    }, 3000);
}

// Carregar produtos
function loadProducts() {
    const productList = document.getElementById("product-list");
    products.forEach(p => {
        const div = document.createElement("div");
        div.className = "product";
        div.innerHTML = `
            <h3>${p.name}</h3>
            <p>${p.coins} Coins + ${p.bonus}</p>
            <div class="price">R$ ${p.price.toFixed(2)}</div>
            <button class="btn" onclick="addToCart(${p.id})">Adicionar ao Carrinho</button>
        `;
        productList.appendChild(div);
    });
}

// Adicionar ao carrinho
function addToCart(id) {
    const product = products.find(p => p.id === id);
    cart.push(product);
    updateCartCount();
    showToast(`✅ ${product.name} adicionado ao carrinho!`);
}

// Atualizar contador
function updateCartCount() {
    const countEl = document.getElementById("cart-count");
    if (countEl) countEl.textContent = cart.length;
}

// Carrinho Modal
const modal = document.getElementById("cart-modal");
const cartIcon = document.getElementById("cart-icon");
const closeBtn = document.querySelector(".close");
const cartItemsList = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");

if (cartIcon) {
    cartIcon.onclick = () => {
        updateCartModal();
        modal.style.display = "block";
    };
}

if (closeBtn) {
    closeBtn.onclick = () => (modal.style.display = "none");
}

window.onclick = (e) => {
    if (e.target === modal) modal.style.display = "none";
};

function updateCartModal() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = "";
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - R$ ${item.price.toFixed(2)}`;
        cartItemsList.appendChild(li);
        total += item.price;
    });
    cartTotal.textContent = total.toFixed(2);
}

if (checkoutBtn) {
    checkoutBtn.onclick = () => {
        if (cart.length === 0) {
            showToast("⚠️ Seu carrinho está vazio!");
            return;
        }
        if (!currentUser) {
            showToast("🔒 Faça login para comprar.");
            setTimeout(() => (window.location.href = "login.html"), 1000);
            return;
        }
        showToast(`💰 Compra de R$${parseFloat(cartTotal.textContent).toFixed(2)} realizada!`);
        setTimeout(() => {
            alert("Pagamento simulado com sucesso! (Integre com Mercado Pago em produção)");
            cart = [];
            updateCartCount();
            modal.style.display = "none";
            savePurchaseHistory();
        }, 1500);
    };
}

// Login
if (document.getElementById("login-form")) {
    document.getElementById("login-form").addEventListener("submit", function(e) {
        e.preventDefault();
        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;

        if (username && password.length >= 4) {
            currentUser = username;
            localStorage.setItem("currentUser", username);
            if (!localStorage.getItem("userCoins")) {
                localStorage.setItem("userCoins", 1500);
            }
            showToast(`🎉 Bem-vindo, ${username}!`);
            setTimeout(() => (window.location.href = "index.html"), 1000);
        } else {
            showToast("❌ Usuário ou senha inválidos.");
        }
    });
}

// Criar conta
function createAccount() {
    showToast("🛠️ Sistema de cadastro em breve!");
}

// Carregar usuário no painel
function loadUserPanel() {
    const username = localStorage.getItem("currentUser");
    if (!username) {
        window.location.href = "login.html";
        return;
    }
    currentUser = username;
    document.getElementById("panel-username").textContent = username;
    document.getElementById("user-coins").textContent = parseInt(localStorage.getItem("userCoins")) || 0;
}

// Salvar histórico
function savePurchaseHistory() {
    const now = new Date().toLocaleDateString("pt-BR");
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    cart.forEach(item => {
        purchases.push({ name: item.name, price: item.price, date: now });
    });
    localStorage.setItem("purchases", JSON.stringify(purchases));
}

// Carregar histórico
function loadPurchaseHistory() {
    const purchases = JSON.parse(localStorage.getItem("purchases") || "[]");
    const historyList = document.getElementById("purchase-history");
    if (!historyList) return;
    historyList.innerHTML = purchases.length ? "" : "<li>Nenhuma compra realizada.</li>";
    purchases.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.name} - R$ ${p.price.toFixed(2)} - ${p.date}`;
        historyList.appendChild(li);
    });
}

// Inicialização
document.addEventListener("DOMContentLoaded", function () {
    addThemeToggle();

    if (document.getElementById("product-list")) {
        loadProducts();
        updateCartCount();
        const savedUser = localStorage.getItem("currentUser");
        if (savedUser) {
            currentUser = savedUser;
            document.getElementById("user-greeting").textContent = `Olá, ${savedUser}!`;
        }
    }

    if (document.getElementById("panel-username")) {
        loadUserPanel();
        loadPurchaseHistory();
    }
});
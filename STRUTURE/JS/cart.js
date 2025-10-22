function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(product) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
        showToast('Quantidade atualizada no carrinho!');
    } else {
        cart.push({ ...product, quantity: 1 });
        showToast('Produto adicionado ao carrinho!');
    }
    
    saveCart(cart);
}

function updateQuantity(productId, quantity) {
    const cart = getCart();
    const item = cart.find(item => item.id === productId);
    
    if (item && quantity > 0) {
        item.quantity = quantity;
        saveCart(cart);
        loadCartPage();
    }
}

function removeFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== productId);
    saveCart(cart);
    showToast('Produto removido do carrinho');
    loadCartPage();
}

function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
}

function getCartCount() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
    const badge = document.getElementById('cartCount');
    const count = getCartCount();
    
    if (badge) {
        if (count > 0) {
            badge.textContent = count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function calculateTotal(cart) {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 0 ? 20 : 0;
    const total = subtotal + shipping;
    
    return { subtotal, shipping, total };
}
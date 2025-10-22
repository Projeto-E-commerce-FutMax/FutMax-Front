// Dark Mode Management
function initDarkMode() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Toast Notification
function showToast(message) {
    const toastEl = document.getElementById('toast');
    const toastBody = toastEl.querySelector('.toast-body');
    toastBody.textContent = message;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Header Component
function loadHeader() {
    const user = getUser();
    const cartCount = getCartCount();
    const isDarkMode = document.body.classList.contains('dark-mode');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const headerHTML = `
        <nav class="navbar navbar-expand-lg main-header">
            <div class="container">
                <a class="navbar-brand logo" href="index.html">FutMax</a>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav mx-auto">
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}" href="index.html">Início</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'camisas.html' ? 'active' : ''}" href="camisas.html">Camisas</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link ${currentPage === 'exclusivo.html' ? 'active' : ''}" href="exclusivo.html">Exclusivo</a>
                        </li>
                    </ul>
                    
                    <div class="d-flex align-items-center gap-2">
                        <!-- Search Box (hidden on mobile) -->
                        <div class="search-box d-none d-lg-flex align-items-center px-3 py-2">
                            <i class="bi bi-search text-muted me-2"></i>
                            <input type="text" placeholder="Buscar camisas..." style="width: 200px;">
                        </div>
                        
                        <!-- Dark Mode Toggle -->
                        <button class="btn btn-link text-decoration-none" onclick="toggleDarkMode()">
                            <i class="bi ${isDarkMode ? 'bi-sun' : 'bi-moon'} fs-5"></i>
                        </button>
                        
                        <!-- User/Login -->
                        ${user ? `
                            <a href="perfil.html" class="btn btn-link text-decoration-none">
                                <i class="bi bi-person fs-5"></i>
                            </a>
                        ` : `
                            <a href="login.html" class="btn btn-outline-secondary d-flex align-items-center gap-2">
                                <i class="bi bi-box-arrow-in-right"></i>
                                <span class="d-none d-lg-inline">Entrar</span>
                            </a>
                        `}
                        
                        <!-- Cart -->
                        <a href="carrinho.html" class="btn btn-link text-decoration-none position-relative">
                            <i class="bi bi-cart3 fs-5"></i>
                            <span id="cartCount" class="cart-badge ${cartCount > 0 ? '' : 'd-none'}">${cartCount}</span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    document.getElementById('header').innerHTML = headerHTML;
}

// Footer Component
function loadFooter() {
    const footerHTML = `
        <footer class="main-footer text-dark">
            <!-- Guarantees Section -->
            <div class="border-bottom py-5">
                <div class="container">
                    <div class="row g-4">
                        <div class="col-md-4 text-center">
                            <div class="footer-icon">
                                <i class="bi bi-shield-check"></i>
                            </div>
                            <h3 class="h5 mb-2">Autenticidade Verificada</h3>
                            <p class="text-muted small">Todas as peças são verificadas por especialistas</p>
                        </div>
                        <div class="col-md-4 text-center">
                            <div class="footer-icon">
                                <i class="bi bi-award"></i>
                            </div>
                            <h3 class="h5 mb-2">Peças de Colecionador</h3>
                            <p class="text-muted small">Edições limitadas e raras que marcaram a história</p>
                        </div>
                        <div class="col-md-4 text-center">
                            <div class="footer-icon">
                                <i class="bi bi-tag"></i>
                            </div>
                            <h3 class="h5 mb-2">Estado Impecável</h3>
                            <p class="text-muted small">Camisetas conservadas em excelente estado</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Main Footer -->
            <div class="container py-5">
                <div class="row g-4">
                    <!-- Brand -->
                    <div class="col-md-3">
                        <h3 class="logo mb-3">FutMax</h3>
                        <p class="text-muted small">
                            A maior loja de camisas de futebol do Brasil. Qualidade garantida e entrega rápida.
                        </p>
                        <div class="d-flex gap-2 mt-3">
                            <a href="#" class="social-icon">
                                <i class="bi bi-facebook"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="bi bi-instagram"></i>
                            </a>
                            <a href="#" class="social-icon">
                                <i class="bi bi-twitter"></i>
                            </a>
                        </div>
                    </div>
                    
                    <!-- Categories -->
                    <div class="col-md-3">
                        <h4 class="h6 mb-3">Categorias</h4>
                        <ul class="list-unstyled">
                            <li class="mb-2">
                                <a href="camisas.html" class="text-muted text-decoration-none small">Camisas Nacionais</a>
                            </li>
                            <li class="mb-2">
                                <a href="camisas.html" class="text-muted text-decoration-none small">Camisas Internacionais</a>
                            </li>
                            <li class="mb-2">
                                <a href="camisas.html" class="text-muted text-decoration-none small">Seleções</a>
                            </li>
                            <li class="mb-2">
                                <a href="camisas.html" class="text-muted text-decoration-none small">Retrô</a>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Support -->
                    <div class="col-md-3">
                        <h4 class="h6 mb-3">Atendimento</h4>
                        <ul class="list-unstyled">
                            <li class="mb-2">
                                <a href="#" class="text-muted text-decoration-none small">Central de Ajuda</a>
                            </li>
                            <li class="mb-2">
                                <a href="#" class="text-muted text-decoration-none small">Trocas e Devoluções</a>
                            </li>
                            <li class="mb-2">
                                <a href="#" class="text-muted text-decoration-none small">Fale Conosco</a>
                            </li>
                            <li class="mb-2">
                                <a href="#" class="text-muted text-decoration-none small">Rastreamento</a>
                            </li>
                        </ul>
                    </div>
                    
                    <!-- Newsletter -->
                    <div class="col-md-3">
                        <h4 class="h6 mb-3">Newsletter</h4>
                        <p class="text-muted small mb-3">Receba ofertas exclusivas e novidades</p>
                        <div class="d-flex gap-2">
                            <input type="email" class="form-control form-control-sm" placeholder="Seu email">
                            <button class="btn btn-primary">→</button>
                        </div>
                    </div>
                </div>
                
                <div class="border-top mt-5 pt-4 text-center">
                    <p class="text-muted small mb-0">
                        © 2025 <span class="text-primary">FutMax</span>. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    `;
    
    document.getElementById('footer').innerHTML = footerHTML;
}

// Product Card Component
function createProductCard(product) {
    return `
        <div class="col">
            <div class="card product-card h-100">
                <div class="product-img-container">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="card-body">
                    <h3 class="h6 mb-2">${product.name}</h3>
                    <p class="text-muted small mb-3">${product.season}</p>
                    
                    <div class="d-flex justify-content-between align-items-center border-top pt-3">
                        <div>
                            <div class="price-primary">R$ ${product.price.toFixed(2)}</div>
                            <small class="text-muted">12x sem juros</small>
                        </div>
                        <button onclick="addToCart(products.find(p => p.id === ${product.id}) || rareProducts.find(p => p.id === ${product.id}))" class="btn-add-cart">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load Featured Products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    const featured = products.slice(0, 8);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Load All Products
function loadAllProducts() {
    const container = document.getElementById('allProducts');
    if (!container) return;
    
    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

// Load Rare Products
function loadRareProducts() {
    const container = document.getElementById('rareProducts');
    if (!container) return;
    
    const rareCardsHTML = rareProducts.map(product => `
        <div class="col">
            <div class="card rare-product-card shadow-lg">
                <div class="position-absolute top-0 start-0 m-3" style="z-index: 20;">
                    <span class="badge bg-gradient text-white px-3 py-2 rounded-pill" style="background: linear-gradient(to right, var(--primary-color), #FF8C5A);">
                        <i class="bi bi-star-fill me-1"></i>
                        ${product.rarity.toUpperCase()}
                    </span>
                </div>
                
                <div class="row g-0 p-4">
                    <div class="col-md-6">
                        <div class="position-relative mb-3">
                            <div class="border border-3 border-primary rounded-3 p-4 bg-light" style="height: 280px;">
                                <img src="${product.image}" alt="${product.name}" class="img-fluid h-100 w-100" style="object-fit: contain;">
                            </div>
                            <div class="position-absolute bottom-0 end-0 translate-middle">
                                <div class="bg-primary rounded-circle p-2 border border-4 border-white">
                                    <i class="bi bi-patch-check-fill text-white fs-3"></i>
                                </div>
                            </div>
                        </div>
                        <div class="bg-light rounded-3 p-3 border border-primary border-opacity-25">
                            <p class="text-center mb-1 small">✨ <strong>Peça de Colecionador</strong> ✨</p>
                            <p class="text-center text-muted mb-0" style="font-size: 11px;">Unidade limitada e autêntica</p>
                        </div>
                    </div>
                    
                    <div class="col-md-6 d-flex flex-column justify-content-between ps-md-4">
                        <div>
                            <h3 class="h4 fw-bold mb-2">${product.name}</h3>
                            <p class="text-primary fw-semibold mb-3">${product.season}</p>
                            
                            ${product.historicalEvent ? `
                                <div class="alert alert-light border-start border-4 border-primary mb-3">
                                    <p class="mb-0 small">
                                        <strong>⚽ Momento Histórico:</strong><br>
                                        ${product.historicalEvent}
                                    </p>
                                </div>
                            ` : ''}
                            
                            <div class="mb-4">
                                <div class="d-flex gap-2 mb-3">
                                    <i class="bi bi-shield-check text-primary fs-5"></i>
                                    <div>
                                        <p class="fw-semibold mb-0 small">Estado de Conservação</p>
                                        <p class="text-muted mb-0" style="font-size: 13px;">${product.condition}</p>
                                    </div>
                                </div>
                                <div class="d-flex gap-2 mb-3">
                                    <i class="bi bi-tag fs-5"></i>
                                    <div>
                                        <p class="fw-semibold mb-0 small">Etiqueta Original</p>
                                        <p class="text-muted mb-0" style="font-size: 13px;">
                                            ${product.hasOriginalTag ? '✓ Preservada e autêntica' : 'Sem etiqueta'}
                                        </p>
                                    </div>
                                </div>
                                <div class="d-flex gap-2">
                                    <i class="bi bi-award text-primary fs-5"></i>
                                    <div>
                                        <p class="fw-semibold mb-0 small">Nível de Raridade</p>
                                        <p class="text-muted mb-0" style="font-size: 13px;">${product.rarity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div>
                            <div class="bg-light rounded-3 p-3 border border-2 border-primary mb-3">
                                <p class="text-muted mb-1 small">Valor de Colecionador</p>
                                <div class="d-flex align-items-baseline gap-2">
                                    <span class="text-primary display-6 fw-bold">R$ ${product.price.toFixed(2)}</span>
                                </div>
                                <p class="text-muted mb-0 small">ou 12x de R$ ${(product.price / 12).toFixed(2)} sem juros</p>
                            </div>
                            
                            <button onclick="addToCart(rareProducts.find(p => p.id === ${product.id}))" 
                                    class="btn btn-primary btn-lg w-100 mb-2">
                                <i class="bi bi-stars me-2"></i>
                                ADICIONAR À COLEÇÃO
                            </button>
                            
                            <p class="text-center text-muted mb-0 small">🔒 Compra 100% segura e certificada</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = rareCardsHTML;
}

// Load Cart Page
function loadCartPage() {
    const container = document.getElementById('cartContent');
    if (!container) return;
    
    const cart = getCart();
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-cart3 display-1 text-muted"></i>
                <h2 class="mt-4 mb-3">Seu carrinho está vazio</h2>
                <p class="text-muted mb-4">Adicione produtos para continuar comprando</p>
                <a href="camisas.html" class="btn btn-primary btn-lg">Ver Produtos</a>
            </div>
        `;
        return;
    }
    
    const { subtotal, shipping, total } = calculateTotal(cart);
    
    container.innerHTML = `
        <div class="row g-4">
            <div class="col-lg-8">
                <div class="card">
                    <div class="card-body">
                        ${cart.map(item => `
                            <div class="d-flex gap-3 p-3 border-bottom">
                                <div class="bg-light rounded" style="width: 100px; height: 100px; flex-shrink: 0;">
                                    <img src="${item.image}" alt="${item.name}" class="img-fluid h-100 w-100 p-2" style="object-fit: contain;">
                                </div>
                                
                                <div class="flex-grow-1">
                                    <h3 class="h6 mb-1">${item.name}</h3>
                                    <p class="text-muted small mb-2">${item.season}</p>
                                    <p class="text-primary fw-bold mb-0">R$ ${item.price.toFixed(2)}</p>
                                </div>
                                
                                <div class="d-flex flex-column align-items-end gap-2">
                                    <button onclick="removeFromCart(${item.id})" class="btn btn-link text-danger p-0">
                                        <i class="bi bi-trash fs-5"></i>
                                    </button>
                                    
                                    <div class="btn-group">
                                        <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})" class="btn btn-outline-secondary btn-sm">−</button>
                                        <span class="btn btn-outline-secondary btn-sm disabled">${item.quantity}</span>
                                        <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})" class="btn btn-outline-secondary btn-sm">+</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="col-lg-4">
                <div class="card sticky-top" style="top: 100px;">
                    <div class="card-body">
                        <h3 class="h5 mb-4">Resumo do Pedido</h3>
                        
                        <div class="mb-3">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Subtotal</span>
                                <span>R$ ${subtotal.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">Frete</span>
                                <span>R$ ${shipping.toFixed(2)}</span>
                            </div>
                            <div class="border-top pt-2">
                                <div class="d-flex justify-content-between">
                                    <span class="fw-bold">Total</span>
                                    <span class="text-primary fw-bold fs-5">R$ ${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                        
                        <a href="checkout.html" class="btn btn-primary w-100 mb-2">Finalizar Pedido</a>
                        <a href="camisas.html" class="btn btn-outline-secondary w-100">Continuar Comprando</a>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Load Checkout Page
function loadCheckoutPage() {
    const container = document.getElementById('checkoutContent');
    if (!container) return;
    
    const cart = getCart();
    const { subtotal, shipping, total } = calculateTotal(cart);
    
    container.innerHTML = `
        <form id="checkoutForm" onsubmit="handleCheckout(event)">
            <div class="row g-4">
                <div class="col-lg-8">
                    <!-- Shipping Info -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <h3 class="h5 mb-4">
                                <i class="bi bi-truck text-primary me-2"></i>
                                Informações de Entrega
                            </h3>
                            
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label">Nome Completo</label>
                                    <input type="text" class="form-control" value="João Silva Santos" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Email</label>
                                    <input type="email" class="form-control" value="joao.silva@email.com" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Telefone</label>
                                    <input type="tel" class="form-control" value="(11) 99999-9999" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">CEP</label>
                                    <input type="text" class="form-control" value="88711-11" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Cidade</label>
                                    <input type="text" class="form-control" value="São Paulo" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Endereço</label>
                                    <input type="text" class="form-control" value="Av. Patrício Lima, 442" required>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Payment Info -->
                    <div class="card">
                        <div class="card-body">
                            <h3 class="h5 mb-4">
                                <i class="bi bi-credit-card text-primary me-2"></i>
                                Informações de Pagamento
                            </h3>
                            
                            <div class="row g-3">
                                <div class="col-12">
                                    <label class="form-label">Número do Cartão</label>
                                    <input type="text" class="form-control" placeholder="1234 5678 9012 3456" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">Validade</label>
                                    <input type="text" class="form-control" placeholder="MM/AA" required>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label">CVV</label>
                                    <input type="text" class="form-control" placeholder="123" required>
                                </div>
                                <div class="col-12">
                                    <label class="form-label">Nome no Cartão</label>
                                    <input type="text" class="form-control" required>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-lg-4">
                    <div class="card sticky-top" style="top: 100px;">
                        <div class="card-body">
                            <h3 class="h5 mb-4">Resumo do Pedido</h3>
                            
                            <div class="mb-4">
                                ${cart.map(item => `
                                    <div class="d-flex gap-2 mb-3">
                                        <div class="bg-light rounded" style="width: 60px; height: 60px; flex-shrink: 0;">
                                            <img src="${item.image}" alt="${item.name}" class="img-fluid h-100 w-100 p-1" style="object-fit: contain;">
                                        </div>
                                        <div class="flex-grow-1">
                                            <p class="small mb-0">${item.name}</p>
                                            <p class="text-muted small mb-0">Qtd: ${item.quantity}</p>
                                        </div>
                                        <span class="small">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="border-top pt-3 mb-3">
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Subtotal</span>
                                    <span>R$ ${subtotal.toFixed(2)}</span>
                                </div>
                                <div class="d-flex justify-content-between mb-2">
                                    <span class="text-muted">Frete</span>
                                    <span>R$ ${shipping.toFixed(2)}</span>
                                </div>
                            </div>
                            
                            <div class="d-flex justify-content-between mb-4 pb-3 border-bottom">
                                <span class="fw-bold">Total</span>
                                <span class="text-primary fw-bold fs-5">R$ ${total.toFixed(2)}</span>
                            </div>
                            
                            <button type="submit" class="btn btn-primary w-100 mb-2">Finalizar Compra</button>
                            <a href="carrinho.html" class="btn btn-outline-secondary w-100">Voltar ao Carrinho</a>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    `;
}

function handleCheckout(event) {
    event.preventDefault();
    
    const container = document.getElementById('checkoutContent');
    container.innerHTML = `
        <div class="card shadow-lg border-0 text-center p-5">
            <i class="bi bi-check-circle text-success display-1 mb-4"></i>
            <h2 class="mb-3">Pedido Realizado com Sucesso!</h2>
            <p class="text-muted mb-4">Obrigado pela sua compra. Você receberá um email com os detalhes do seu pedido.</p>
            <div class="d-flex align-items-center justify-content-center gap-2 text-primary">
                <div class="spinner-border spinner-border-sm" role="status"></div>
                <span>Redirecionando...</span>
            </div>
        </div>
    `;
    
    clearCart();
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 3000);
}

// Load Profile Page
function loadProfilePage() {
    const container = document.getElementById('profileContent');
    if (!container) return;
    
    const user = getUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    container.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div class="card shadow-lg">
                    <div class="card-body p-5">
                        <div class="text-center mb-4">
                            <div class="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                                 style="width: 100px; height: 100px;">
                                <i class="bi bi-person-fill text-white display-4"></i>
                            </div>
                            <h1 class="h3 mb-1">Olá, ${user.name}!</h1>
                            <p class="text-muted">${user.email}</p>
                        </div>
                        
                        <div class="list-group list-group-flush mb-4">
                            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="bi bi-box-seam me-2"></i>
                                    Meus Pedidos
                                </div>
                                <i class="bi bi-chevron-right"></i>
                            </a>
                            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="bi bi-heart me-2"></i>
                                    Lista de Desejos
                                </div>
                                <i class="bi bi-chevron-right"></i>
                            </a>
                            <a href="#" class="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                                <div>
                                    <i class="bi bi-gear me-2"></i>
                                    Configurações
                                </div>
                                <i class="bi bi-chevron-right"></i>
                            </a>
                        </div>
                        
                        <button onclick="logout()" class="btn btn-danger w-100">
                            <i class="bi bi-box-arrow-right me-2"></i>
                            Sair
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    updateCartCount();
});

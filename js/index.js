// Script para página inicial
document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutosDestaque();
    setupSearch();
    setupNewsletter();
});

// Carregar produtos em destaque
async function carregarProdutosDestaque() {
    const container = document.getElementById('produtosDestaque');
    
    try {
        const produtos = await produtoAPI.listar();
        
        if (!produtos || produtos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-inbox display-4 text-muted"></i>
                    <p class="text-muted mt-3">Nenhum produto disponível no momento</p>
                </div>
            `;
            return;
        }

        // Filtrar apenas produtos ativos e pegar os primeiros 4
        const produtosAtivos = produtos.filter(p => p.flAtivo).slice(0, 4);

        container.innerHTML = produtosAtivos.map(produto => `
            <div class="col-md-6 col-lg-3">
                <div class="produto-card" onclick="verProduto(${produto.cdProduto})">
                    <div class="produto-img">
                        <i class="bi bi-image" style="font-size: 3rem;"></i>
                    </div>
                    <h6 class="fw-bold mt-3">${produto.nmProduto}</h6>
                    <p class="text-muted small mb-2" style="height: 40px; overflow: hidden;">
                        ${produto.dsProduto}
                    </p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <p class="preco-novo mb-0">${formatarMoeda(produto.vlProduto)}</p>
                            <p class="text-muted small mb-0">${calcularParcelamento(produto.vlProduto)}</p>
                        </div>
                        <button class="btn-add-cart" onclick="event.stopPropagation(); adicionarAoCarrinho(${produto.cdProduto})">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-exclamation-triangle display-4 text-danger"></i>
                <p class="text-muted mt-3">Erro ao carregar produtos. Tente novamente mais tarde.</p>
            </div>
        `;
    }
}

// Ver detalhes do produto
function verProduto(cdProduto) {
    window.location.href = `produtos.html?id=${cdProduto}`;
}

// Adicionar produto ao carrinho
async function adicionarAoCarrinho(cdProduto) {
    try {
        const produto = await produtoAPI.buscar(cdProduto);
        
        if (!produto.flAtivo) {
            alert('Produto indisponível no momento');
            return;
        }

        cart.addItem(produto);
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        alert('Erro ao adicionar produto ao carrinho');
    }
}

// Configurar busca
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const searchTerm = searchInput.value.trim();
                if (searchTerm) {
                    window.location.href = `produtos.html?search=${encodeURIComponent(searchTerm)}`;
                }
            }
        });
    }
}

// Configurar newsletter
function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            
            // Simular envio (aqui você implementaria a integração com backend)
            alert(`Obrigado por se inscrever! Confirme seu e-mail: ${email}`);
            form.reset();
        });
    }
}

// Verificar se usuário está logado e atualizar UI
function checkUserLogin() {
    const user = localStorage.getItem('futmax_user');
    const userButton = document.getElementById('userButton');
    
    if (user && userButton) {
        const userData = JSON.parse(user);
        userButton.innerHTML = `
            <i class="bi bi-person-circle"></i> 
            <span class="d-none d-lg-inline">${userData.nmUsuario.split(' ')[0]}</span>
        `;
        userButton.href = '#';
        userButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Deseja sair?')) {
                localStorage.removeItem('futmax_user');
                window.location.reload();
            }
        });
    }
}

// Executar verificação de login
checkUserLogin();
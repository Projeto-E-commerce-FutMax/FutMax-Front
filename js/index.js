document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutosDestaque();
    setupSearch();
    updateCartCount();
});

function construirUrlImagem(imgUrl) {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('/api/')) {
        return API_CONFIG.baseURL.replace(/\/$/, '') + '/' + imgUrl.substring(5);
    }
    if (imgUrl.startsWith('/')) {
        return API_CONFIG.baseURL.replace(/\/$/, '') + imgUrl;
    }
    return API_CONFIG.baseURL.replace(/\/$/, '') + '/' + imgUrl.replace(/^\/?/, '');
}

async function carregarProdutosDestaque() {
    const container = document.getElementById('produtosDestaque');
    
    try {
        const resp = await produtoAPI.listar();
        const produtos = Array.isArray(resp)
            ? resp
            : Array.isArray(resp?.content)
                ? resp.content
                : Array.isArray(resp?.data)
                    ? resp.data
                    : Array.isArray(resp?.items)
                        ? resp.items
                        : [];
        
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
        const produtosAtivos = produtos.filter(p => p.flAtivo === true || p.flAtivo === 'true' || p.ativo === true).slice(0, 4);
        
        // Determinar estoque a partir de possíveis formatos
        const produtosComEstoque = produtosAtivos.map(produto => ({
            ...produto,
            estoque: Number(
                produto.qtEstoque ??
                produto.estoque?.qtEstoque ??
                produto.estoque ??
                0
            ) || 0
        }));
        
        // Armazenar globalmente para uso na função adicionarAoCarrinho
        window.listaProdutosComEstoque = produtosComEstoque;

        container.innerHTML = produtosComEstoque.map(produto => `
            <div class="col-sm-6 col-lg-3">
                <div class="card border-0 shadow-sm h-100" onclick="verProduto(${produto.cdProduto})" style="cursor:pointer;">
                    <div class="p-3 d-flex align-items-center justify-content-center" style="height:200px;background: var(--bs-secondary-bg);">
                        ${produto.imgUrl ? `<img src="${construirUrlImagem(produto.imgUrl)}" alt="${produto.nmProduto}" class="img-fluid" style="max-height:100%;object-fit:contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><i class=\"bi bi-image\" style=\"font-size:3rem; display:none;\"></i>` : `<i class=\"bi bi-image\" style=\"font-size:3rem;\"></i>`}
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h6 class="fw-bold mb-1">${produto.nmProduto}</h6>
                        <p class="text-muted small mb-2" style="min-height:40px;">${produto.dsProduto || ''}</p>
                        <div class="mt-auto d-flex justify-content-between align-items-center">
                            <div class="fw-bold text-primary">${formatarMoeda(produto.vlProduto)}</div>
                            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); adicionarAoCarrinho(${produto.cdProduto})" ${produto.estoque === 0 ? 'disabled' : ''} title="Adicionar ao carrinho">
                                <i class="bi bi-cart-plus"></i>
                            </button>
                        </div>
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
function adicionarAoCarrinho(cdProduto) {
    const produto = window.listaProdutosComEstoque?.find(p => p.cdProduto === cdProduto);
    
    if (!produto) {
        console.error('❌ Produto não encontrado na lista');
        mostrarToast('Produto não encontrado!', 'error');
        return;
    }
    
    if (produto.estoque === 0) {
        mostrarToast('Produto sem estoque!', 'warning');
        return;
    }
    
    // Verificar se já existe no carrinho
    let carrinho = JSON.parse(localStorage.getItem('futmax_carrinho') || '[]');
    const itemExistente = carrinho.find(item => item.cdProduto === cdProduto);
    
    if (itemExistente) {
        if (itemExistente.quantidade >= produto.estoque) {
            mostrarToast('Quantidade máxima em estoque atingida!', 'warning');
            return;
        }
        itemExistente.quantidade += 1;
    } else {
        const novoItem = {
            cdProduto: produto.cdProduto,
            nmProduto: produto.nmProduto,
            vlProduto: produto.vlProduto,
            imgUrl: produto.imgUrl,
            quantidade: 1
        };
        carrinho.push(novoItem);
    }
    
    localStorage.setItem('futmax_carrinho', JSON.stringify(carrinho));
    mostrarToast(`${produto.nmProduto} adicionado ao carrinho!`, 'success');
    updateCartCount();
}

function updateCartCount() {
    const carrinho = JSON.parse(localStorage.getItem('futmax_carrinho') || '[]');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItens;
    }
}

function mostrarToast(mensagem, tipo = 'success') {
    // Criar notificação toast se não existir
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'toast-index-' + Date.now();
    const bgClass = tipo === 'success' ? 'bg-success' : tipo === 'error' ? 'bg-danger' : tipo === 'info' ? 'bg-info' : 'bg-warning';
    const iconClass = tipo === 'success' ? 'bi-check-circle-fill' : tipo === 'error' ? 'bi-exclamation-circle-fill' : tipo === 'info' ? 'bi-info-circle-fill' : 'bi-exclamation-triangle-fill';
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${bgClass} text-white">
                <i class="bi ${iconClass} me-2"></i>
                <strong class="me-auto">${tipo === 'success' ? 'Sucesso' : tipo === 'error' ? 'Erro' : tipo === 'info' ? 'Informação' : 'Aviso'}</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${mensagem}
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
    toast.show();
    
    // Remover o elemento após ser escondido
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

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

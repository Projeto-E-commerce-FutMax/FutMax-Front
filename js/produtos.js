document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutosPagina();
    setupFiltrosProdutos();
    updateCartCount();
});

// Função auxiliar para construir URL da imagem
function construirUrlImagem(imgUrl) {
    if (!imgUrl) return null;
    // Se já começa com /api/, remove o /api/ inicial para evitar duplicação
    if (imgUrl.startsWith('/api/')) {
        return API_CONFIG.baseURL + imgUrl.substring(4); // Remove '/api' e mantém o resto
    }
    // Se começa com /, adiciona o baseURL diretamente
    if (imgUrl.startsWith('/')) {
        return API_CONFIG.baseURL + imgUrl;
    }
    // Se não começa com /, adiciona /api/ + imgUrl
    return API_CONFIG.baseURL + '/api/' + imgUrl;
}

let listaProdutos = [];
let produtosVisiveis = [];

async function carregarProdutosPagina() {
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('emptyState');
    try {
        const produtos = await produtoAPI.listar();
        
        const produtosAtivos = Array.isArray(produtos) ? produtos.filter(p => p.flAtivo) : [];
        
        // Os produtos já vêm com estoque do backend (qtEstoque)
        const produtosComEstoque = produtosAtivos.map(produto => {
            return {
                ...produto,
                estoque: produto.qtEstoque || 0
            };
        });
        
        listaProdutos = produtosComEstoque;
        produtosVisiveis = [...listaProdutos];
        renderProdutos();
        document.getElementById('productCount').textContent = `${produtosVisiveis.length} produtos`;
        grid.classList.remove('d-none');
        empty.classList.add('d-none');
    } catch (e) {
        console.error('❌ Erro ao listar produtos:', e);
        grid.classList.add('d-none');
        empty.classList.remove('d-none');
    }
}

function renderProdutos() {
    const grid = document.getElementById('productsGrid');
    if (!produtosVisiveis || produtosVisiveis.length === 0) {
        grid.innerHTML = '';
        document.getElementById('emptyState').classList.remove('d-none');
        return;
    }
    document.getElementById('emptyState').classList.add('d-none');
    
    grid.innerHTML = produtosVisiveis.map(produto => `
        <div class="col-sm-6 col-lg-4">
            <div class="card border-0 shadow-sm h-100">
                <div class="p-3 d-flex align-items-center justify-content-center" style="height:200px;background:#f8f9fa;">
                    ${produto.imgUrl ? `<img src="${construirUrlImagem(produto.imgUrl)}" alt="${produto.nmProduto}" class="img-fluid" style="max-height:100%;object-fit:contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><i class=\"bi bi-image\" style=\"font-size:3rem; display:none;\"></i>` : `<i class=\"bi bi-image\" style=\"font-size:3rem;\"></i>`}
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="fw-bold mb-1">${produto.nmProduto}</h6>
                    <p class="text-muted small mb-2" style="min-height:40px;">${produto.dsProduto}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-primary">${formatarMoeda(produto.vlProduto)}</div>
                            <div class="text-muted small">${calcularParcelamento(produto.vlProduto)}</div>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="adicionarAoCarrinho(${produto.cdProduto})" ${produto.estoque === 0 ? 'disabled' : ''} title="Adicionar ao carrinho">
                            <i class="bi bi-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFiltrosProdutos() {
    const search = document.getElementById('filterSearch');
    const sort = document.getElementById('sortBy');
    const category = document.getElementById('filterCategory');
    const min = document.getElementById('minPrice');
    const max = document.getElementById('maxPrice');
    const ativos = document.getElementById('filterAtivos');
    const apply = document.getElementById('applyFilters');
    const clear = document.getElementById('clearFilters');

    // Pré-selecionar categoria pela querystring (?categoria=)
    try {
        const params = new URLSearchParams(window.location.search);
        const cat = (params.get('categoria') || '').toUpperCase();
        if (cat && category) {
            // Normalizar possíveis aliases
            const map = {
                'NACIONAL': 'NACIONAL',
                'INTERNACIONAL': 'INTERNACIONAL',
                'RETRO': 'RETRÔ',
                'RETRÔ': 'RETRÔ',
                'EXCLUSIVA': 'EXCLUSIVA',
                'SELECOES': 'SELEÇÕES',
                'SELEÇÕES': 'SELEÇÕES'
            };
            const value = map[cat] || cat;
            if ([...category.options].some(o => o.value === value)) {
                category.value = value;
            }
        }
    } catch(_) {}

    const applyFilters = () => {
        const termo = (search.value || '').toLowerCase();
        const categoria = category ? (category.value || '') : '';
        const minVal = parseFloat(min.value) || 0;
        const maxVal = parseFloat(max.value) || Number.MAX_VALUE;
        produtosVisiveis = listaProdutos.filter(p => {
            const okNome = p.nmProduto.toLowerCase().includes(termo);
            const okCategoria = !categoria || (p.nmCategoria && p.nmCategoria === categoria);
            const okPreco = p.vlProduto >= minVal && p.vlProduto <= maxVal;
            const okAtivo = !ativos.checked || p.flAtivo;
            return okNome && okCategoria && okPreco && okAtivo;
        });
        switch (sort.value) {
            case 'nome':
                produtosVisiveis.sort((a, b) => a.nmProduto.localeCompare(b.nmProduto));
                break;
            case 'menor-preco':
                produtosVisiveis.sort((a, b) => a.vlProduto - b.vlProduto);
                break;
            case 'maior-preco':
                produtosVisiveis.sort((a, b) => b.vlProduto - a.vlProduto);
                break;
            case 'novidades':
                produtosVisiveis.sort((a, b) => b.cdProduto - a.cdProduto);
                break;
        }
        document.getElementById('productCount').textContent = `${produtosVisiveis.length} produtos`;
        renderProdutos();
    };

    if (apply) apply.addEventListener('click', applyFilters);
    if (clear) clear.addEventListener('click', () => {
        search.value = '';
        sort.value = 'nome';
        if (category) category.value = '';
        min.value = 0;
        max.value = 500;
        ativos.checked = true;
        applyFilters();
    });

    // Aplicar automaticamente ao carregar (considerando querystring)
    applyFilters();
}

// Ver detalhes do produto
function verProduto(cdProduto) {
    window.location.href = `produtos.html?id=${cdProduto}`;
}

// Adicionar produto ao carrinho
function adicionarAoCarrinho(cdProduto) {
    const produto = listaProdutos.find(p => p.cdProduto === cdProduto);
    
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

// Atualizar contador do carrinho
function updateCartCount() {
    const carrinho = JSON.parse(localStorage.getItem('futmax_carrinho') || '[]');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItens;
    }
}

// Função para mostrar toast
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
    
    const toastId = 'toast-' + Date.now();
    const bgClass = tipo === 'success' ? 'bg-success' : tipo === 'error' ? 'bg-danger' : 'bg-warning';
    const iconClass = tipo === 'success' ? 'bi-check-circle-fill' : tipo === 'error' ? 'bi-exclamation-circle-fill' : 'bi-info-circle-fill';
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${bgClass} text-white">
                <i class="bi ${iconClass} me-2"></i>
                <strong class="me-auto">${tipo === 'success' ? 'Sucesso' : tipo === 'error' ? 'Erro' : 'Aviso'}</strong>
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


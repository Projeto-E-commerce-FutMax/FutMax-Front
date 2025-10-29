// Script para página inicial
document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutosDestaque();
    setupSearch();
    setupNewsletter();
    updateCartCount();
    setupEstoqueUpdateListener();
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

// Carregar produtos em destaque
async function carregarProdutosDestaque() {
    const container = document.getElementById('produtosDestaque');
    
    try {
        console.log('🔄 Carregando produtos em destaque...');
        const produtos = await produtoAPI.listar();
        console.log('📦 Produtos recebidos (index):', produtos);
        
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
        console.log('✅ Produtos ativos (index):', produtosAtivos);
        
        // Os produtos já vêm com estoque do backend (qtEstoque)
        const produtosComEstoque = produtosAtivos.map(produto => {
            console.log(`📊 Produto ${produto.nmProduto}: qtEstoque = ${produto.qtEstoque}`);
            return {
                ...produto,
                estoque: produto.qtEstoque || 0
            };
        });
        
        console.log('🎯 Produtos com estoque (index):', produtosComEstoque);
        
        // Armazenar globalmente para uso na função adicionarAoCarrinho
        window.listaProdutosComEstoque = produtosComEstoque;

        container.innerHTML = produtosComEstoque.map(produto => `
            <div class="col-md-6 col-lg-3">
                <div class="produto-card" onclick="verProduto(${produto.cdProduto})">
                    <div class="produto-img d-flex align-items-center justify-content-center">
                        ${produto.imgUrl ? `<img src="${construirUrlImagem(produto.imgUrl)}" alt="${produto.nmProduto}" class="img-fluid" style="max-height:140px; object-fit:contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><i class="bi bi-image" style="font-size: 3rem; display:none;"></i>` : `<i class="bi bi-image" style="font-size: 3rem;"></i>`}
                    </div>
                    <h6 class="fw-bold mt-3">${produto.nmProduto}</h6>
                    <p class="text-muted small mb-2" style="height: 40px; overflow: hidden;">
                        ${produto.dsProduto}
                    </p>
                    <div class="mb-2">
                        <span class="badge ${produto.estoque > 0 ? 'bg-success' : 'bg-danger'}">
                            ${produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Sem estoque'}
                        </span>
                    </div>
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <p class="preco-novo mb-0">${formatarMoeda(produto.vlProduto)}</p>
                            <p class="text-muted small mb-0">${calcularParcelamento(produto.vlProduto)}</p>
                        </div>
                        <button class="btn-add-cart" onclick="event.stopPropagation(); adicionarAoCarrinho(${produto.cdProduto})" ${produto.estoque === 0 ? 'disabled' : ''}>
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
function adicionarAoCarrinho(cdProduto) {
    console.log('🛒 Tentando adicionar produto ao carrinho (index):', cdProduto);
    console.log('📦 Lista de produtos disponível (index):', window.listaProdutosComEstoque);
    
    // Buscar o produto na lista de produtos com estoque
    const produto = window.listaProdutosComEstoque?.find(p => p.cdProduto === cdProduto);
    console.log('🔍 Produto encontrado (index):', produto);
    
    if (!produto) {
        console.error('❌ Produto não encontrado na lista (index)');
        if (typeof showToast === 'function') {
            showToast('Produto não encontrado!', 'error');
        } else if (typeof mostrarToast === 'function') {
            mostrarToast('Produto não encontrado!', 'error');
        } else {
            alert('Produto não encontrado!');
        }
        return;
    }
    
    if (produto.estoque === 0) {
        console.log('⚠️ Produto sem estoque (index)');
        if (typeof showToast === 'function') {
            showToast('Produto sem estoque!', 'warning');
        } else if (typeof mostrarToast === 'function') {
            mostrarToast('Produto sem estoque!', 'warning');
        } else {
            alert('Produto sem estoque!');
        }
        return;
    }
    
    console.log('✅ Produto válido, adicionando ao carrinho (index)...');
    
    // Verificar se já existe no carrinho
    let carrinho = JSON.parse(localStorage.getItem('futmax_carrinho') || '[]');
    console.log('🛒 Carrinho atual (index):', carrinho);
    
    const itemExistente = carrinho.find(item => item.cdProduto === cdProduto);
    console.log('🔍 Item existente (index):', itemExistente);
    
    if (itemExistente) {
        if (itemExistente.quantidade >= produto.estoque) {
            console.log('⚠️ Quantidade máxima atingida (index)');
            if (typeof showToast === 'function') {
                showToast('Quantidade máxima em estoque atingida!', 'warning');
            } else if (typeof mostrarToast === 'function') {
                mostrarToast('Quantidade máxima em estoque atingida!', 'warning');
            } else {
                alert('Quantidade máxima em estoque atingida!');
            }
            return;
        }
        itemExistente.quantidade += 1;
        console.log('➕ Quantidade aumentada para (index):', itemExistente.quantidade);
    } else {
        const novoItem = {
            cdProduto: produto.cdProduto,
            nmProduto: produto.nmProduto,
            vlProduto: produto.vlProduto,
            imgUrl: produto.imgUrl,
            quantidade: 1
        };
        carrinho.push(novoItem);
        console.log('➕ Novo item adicionado (index):', novoItem);
    }
    
    localStorage.setItem('futmax_carrinho', JSON.stringify(carrinho));
    console.log('💾 Carrinho salvo (index):', carrinho);
    
    // Usar showToast do config.js se disponível, senão usar alert
    if (typeof showToast === 'function') {
        showToast(`${produto.nmProduto} adicionado ao carrinho!`, 'success');
    } else if (typeof mostrarToast === 'function') {
        mostrarToast(`${produto.nmProduto} adicionado ao carrinho!`, 'success');
    } else {
        alert(`${produto.nmProduto} adicionado ao carrinho!`);
    }
    
    // Atualizar contador do carrinho
    updateCartCount();
    console.log('✅ Produto adicionado com sucesso (index)!');
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

// Configurar listener para atualizações de estoque
function setupEstoqueUpdateListener() {
    // Verificar se há sinal para forçar atualização
    const forcarAtualizacao = localStorage.getItem('forcar_atualizacao_produtos');
    const ultimaVerificacao = localStorage.getItem('ultima_verificacao_produtos_index') || '0';
    
    if (forcarAtualizacao && parseInt(forcarAtualizacao) > parseInt(ultimaVerificacao)) {
        // Houve atualização, mostrar aviso
        mostrarAvisoAtualizacaoIndex();
        localStorage.setItem('ultima_verificacao_produtos_index', forcarAtualizacao);
    }
    
    // Verificar atualizações a cada 10 segundos (mais frequente)
    setInterval(async () => {
        const novaAtualizacao = localStorage.getItem('forcar_atualizacao_produtos');
        if (novaAtualizacao && parseInt(novaAtualizacao) > parseInt(ultimaVerificacao)) {
            mostrarAvisoAtualizacaoIndex();
            localStorage.setItem('ultima_verificacao_produtos_index', novaAtualizacao);
        }
    }, 10000);
}

// Mostrar aviso de atualização disponível na página inicial
function mostrarAvisoAtualizacaoIndex() {
    // Criar notificação toast se não existir
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '9999';
        document.body.appendChild(toastContainer);
    }
    
    const toastId = 'aviso-index-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header bg-info text-white">
                <i class="bi bi-info-circle-fill me-2"></i>
                <strong class="me-auto">Estoque Atualizado</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                O estoque foi atualizado! <a href="produtos.html" class="btn btn-sm btn-primary ms-2">Ver Produtos</a>
            </div>
        </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 10000 }); // 10 segundos
    toast.show();
    
    // Remover o elemento após ser escondido
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
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

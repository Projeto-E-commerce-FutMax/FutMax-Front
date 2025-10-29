// Script para página de carrinho
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    setupFinalizarPedido();
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

// Carregar itens do carrinho
function carregarCarrinho() {
    const container = document.getElementById('cartItems');
    const emptyCart = document.getElementById('emptyCart');
    const finalizarButton = document.getElementById('finalizarPedido');
    
    const items = cart.getItems();
    
    if (items.length === 0) {
        container.parentElement.classList.add('d-none');
        emptyCart.classList.remove('d-none');
        finalizarButton.disabled = true;
        return;
    }
    
    container.parentElement.classList.remove('d-none');
    emptyCart.classList.add('d-none');
    finalizarButton.disabled = false;
    
    // Renderizar itens
    container.innerHTML = items.map(item => `
        <div class="cart-item d-flex align-items-center gap-3 p-3 border-bottom" data-product-id="${item.cdProduto}">
            <div class="cart-item-img bg-light d-flex align-items-center justify-content-center" style="width: 80px; height: 80px; border-radius: 8px;">
                ${item.imgUrl ? 
                    `<img src="${construirUrlImagem(item.imgUrl)}" alt="${item.nmProduto}" class="img-fluid" style="max-width: 100%; max-height: 100%; object-fit: contain;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                     <i class="bi bi-image text-muted" style="font-size: 2rem; display:none;"></i>` : 
                    `<i class="bi bi-image text-muted" style="font-size: 2rem;"></i>`
                }
            </div>
            
            <div class="flex-grow-1">
                <h6 class="fw-bold mb-1">${item.nmProduto}</h6>
                <p class="text-muted small mb-2">${item.dsProduto || ''}</p>
                <p class="fw-bold text-primary mb-0">${formatarMoeda(item.vlProduto)}</p>
            </div>
            
            <div class="quantity-control d-flex align-items-center gap-2">
                <button class="btn btn-outline-secondary btn-sm" onclick="diminuirQuantidade(${item.cdProduto})" style="width: 32px; height: 32px; padding: 0;">
                    <i class="bi bi-dash"></i>
                </button>
                <input type="number" 
                       class="form-control text-center" 
                       value="${item.quantidade}" 
                       min="1" 
                       style="width: 60px;"
                       onchange="atualizarQuantidade(${item.cdProduto}, this.value)"
                       readonly>
                <button class="btn btn-outline-secondary btn-sm" onclick="aumentarQuantidade(${item.cdProduto})" style="width: 32px; height: 32px; padding: 0;">
                    <i class="bi bi-plus"></i>
                </button>
            </div>
            
            <div class="text-end" style="min-width: 120px;">
                <p class="fw-bold mb-1 fs-5">${formatarMoeda(item.vlProduto * item.quantidade)}</p>
                <button class="btn btn-sm btn-link text-danger p-0" onclick="removerItem(${item.cdProduto})">
                    <i class="bi bi-trash"></i> Remover
                </button>
            </div>
        </div>
    `).join('');
    
    atualizarResumo();
}

// Aumentar quantidade
function aumentarQuantidade(cdProduto) {
    const item = cart.getItems().find(i => i.cdProduto === cdProduto);
    if (item) {
        cart.updateQuantity(cdProduto, item.quantidade + 1);
        carregarCarrinho();
    }
}

// Diminuir quantidade
function diminuirQuantidade(cdProduto) {
    const item = cart.getItems().find(i => i.cdProduto === cdProduto);
    if (item && item.quantidade > 1) {
        cart.updateQuantity(cdProduto, item.quantidade - 1);
        carregarCarrinho();
    }
}

// Atualizar quantidade manualmente
function atualizarQuantidade(cdProduto, quantidade) {
    const qtd = parseInt(quantidade);
    if (qtd > 0) {
        cart.updateQuantity(cdProduto, qtd);
        carregarCarrinho();
    }
}

// Remover item
function removerItem(cdProduto) {
    if (confirm('Deseja remover este item do carrinho?')) {
        cart.removeItem(cdProduto);
        carregarCarrinho();
    }
}

// Atualizar resumo do pedido
function atualizarResumo() {
    const subtotal = cart.getSubtotal();
    const frete = cart.getShipping();
    const total = cart.getTotal();
    
    document.getElementById('subtotal').textContent = formatarMoeda(subtotal);
    document.getElementById('shipping').textContent = frete === 0 ? 'Grátis' : formatarMoeda(frete);
    document.getElementById('total').textContent = formatarMoeda(total);
    
    // Mostrar/ocultar alerta de frete grátis
    const freteGratisAlert = document.getElementById('freteGratisAlert');
    if (subtotal >= 200) {
        freteGratisAlert.classList.remove('alert-success');
        freteGratisAlert.classList.add('alert-info');
        freteGratisAlert.innerHTML = '<i class="bi bi-check-circle"></i> Você ganhou frete grátis!';
    } else {
        const faltam = 200 - subtotal;
        freteGratisAlert.classList.remove('alert-info');
        freteGratisAlert.classList.add('alert-success');
        freteGratisAlert.innerHTML = `<i class="bi bi-truck"></i> Faltam ${formatarMoeda(faltam)} para frete grátis`;
    }
}

// Configurar botão de finalizar pedido
function setupFinalizarPedido() {
    const finalizarButton = document.getElementById('finalizarPedido');
    const modalConfirmar = new bootstrap.Modal(document.getElementById('modalConfirmarPedido'));
    
    finalizarButton.addEventListener('click', () => {
        const items = cart.getItems();
        
        if (items.length === 0) {
            mostrarToast('Seu carrinho está vazio!', 'warning');
            return;
        }
        
        // Preencher modal com resumo
        preencherModalConfirmacao(items);
        
        // Mostrar modal
        modalConfirmar.show();
    });
    
    // Botão de confirmação no modal
    document.getElementById('btnConfirmarFinalizar').addEventListener('click', async () => {
        const items = cart.getItems();
        const btnConfirmar = document.getElementById('btnConfirmarFinalizar');
        
        try {
            // Desabilitar botão durante o processamento
            btnConfirmar.disabled = true;
            btnConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';
            
            console.log('🛒 Finalizando pedido...');
            console.log('📦 Itens do carrinho:', items);
            
            // Atualizar estoque para cada item usando o endpoint fictício
            for (const item of items) {
                console.log(`📉 Baixando estoque para ${item.nmProduto}: ${item.quantidade} unidades`);
                
                try {
                    // Usar o novo endpoint que não requer autenticação
                    await estoqueAPI.baixarEstoqueFicticio(item.cdProduto, item.quantidade);
                    console.log(`✅ Estoque baixado para ${item.nmProduto}: ${item.quantidade} unidades`);
                    
                } catch (error) {
                    console.error(`❌ Erro ao baixar estoque para ${item.nmProduto}:`, error);
                    throw new Error(`Erro ao processar ${item.nmProduto}: ${error.message || 'Estoque insuficiente'}`);
                }
            }
            
            // Gerar número do pedido
            const numeroPedido = 'PED' + Date.now();
            
            // Calcular total antes de limpar o carrinho
            const totalPedido = cart.getTotal();
            
            // Fechar modal de confirmação
            modalConfirmar.hide();
            
            // Limpar carrinho
            cart.clear();
            
            // Mostrar sucesso
            mostrarSucessoPedido(numeroPedido, items, totalPedido);
            
        } catch (error) {
            console.error('❌ Erro ao finalizar pedido:', error);
            
            // Mostrar erro
            mostrarToast('Erro ao finalizar pedido: ' + (error.message || 'Erro desconhecido'), 'error');
            
            // Reabilitar botão
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = '<i class="bi bi-check-circle me-2"></i>Confirmar Pedido';
        }
    });
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
    
    const toastId = 'toast-carrinho-' + Date.now();
    const bgClass = tipo === 'success' ? 'bg-success' : tipo === 'error' ? 'bg-danger' : tipo === 'warning' ? 'bg-warning' : 'bg-info';
    const iconClass = tipo === 'success' ? 'bi-check-circle-fill' : tipo === 'error' ? 'bi-exclamation-circle-fill' : tipo === 'warning' ? 'bi-exclamation-triangle-fill' : 'bi-info-circle-fill';
    
    const toastHtml = `
        <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header ${bgClass} text-white">
                <i class="bi ${iconClass} me-2"></i>
                <strong class="me-auto">${tipo === 'success' ? 'Sucesso' : tipo === 'error' ? 'Erro' : tipo === 'warning' ? 'Aviso' : 'Informação'}</strong>
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

// Preencher modal de confirmação
function preencherModalConfirmacao(items) {
    const resumoHtml = items.map(item => `
        <div class="d-flex justify-content-between align-items-center mb-2">
            <div>
                <strong>${item.nmProduto}</strong>
                <small class="text-muted d-block">Qtd: ${item.quantidade}</small>
            </div>
            <span class="fw-bold">${formatarMoeda(item.vlProduto * item.quantidade)}</span>
        </div>
    `).join('');
    
    document.getElementById('modalResumoItens').innerHTML = resumoHtml;
    document.getElementById('modalTotalPedido').textContent = formatarMoeda(cart.getTotal());
}

// Mostrar modal de sucesso do pedido
function mostrarSucessoPedido(numeroPedido, items, totalPedido) {
    const modalHtml = `
        <div class="modal fade" id="sucessoModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-success text-white border-0">
                        <h5 class="modal-title fw-bold">
                            <i class="bi bi-check-circle-fill me-2"></i>
                            Pedido Finalizado com Sucesso!
                        </h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <i class="bi bi-check-circle-fill text-success" style="font-size: 4rem;"></i>
                            <h4 class="mt-3 text-success">Pedido Confirmado!</h4>
                            <p class="text-muted">Número do pedido: <strong>${numeroPedido}</strong></p>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h6 class="mb-0">Resumo do Pedido</h6>
                            </div>
                            <div class="card-body">
                                ${items.map(item => `
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <div>
                                            <strong>${item.nmProduto}</strong>
                                            <small class="text-muted d-block">Qtd: ${item.quantidade}</small>
                                        </div>
                                        <span class="fw-bold">${formatarMoeda(item.vlProduto * item.quantidade)}</span>
                                    </div>
                                `).join('')}
                                <hr>
                                <div class="d-flex justify-content-between align-items-center">
                                    <strong>Total:</strong>
                                    <strong class="text-success fs-5">${formatarMoeda(totalPedido)}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div class="alert alert-info mt-3">
                            <i class="bi bi-info-circle me-2"></i>
                            <strong>Obrigado pela sua compra!</strong><br>
                            O estoque foi atualizado automaticamente. Você receberá um e-mail de confirmação em breve.
                        </div>
                    </div>
                    <div class="modal-footer border-0">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="window.location.href='index.html'">
                            <i class="bi bi-house me-2"></i>Voltar ao Início
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remover modal anterior se existir
    const existingModal = document.getElementById('sucessoModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Adicionar novo modal
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    modal.show();
    
    // Remover modal após fechar
    document.getElementById('sucessoModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('sucessoModal').remove();
    });
}
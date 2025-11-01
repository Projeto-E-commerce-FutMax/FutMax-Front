document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    setupFinalizarPedido();
});

function construirUrlImagem(imgUrl) {
    if (!imgUrl) return null;
    if (imgUrl.startsWith('/api/')) {
        return API_CONFIG.baseURL + imgUrl.substring(4); // Remove '/api' e mantém o resto
    }
    if (imgUrl.startsWith('/')) {
        return API_CONFIG.baseURL + imgUrl;
    }
    return API_CONFIG.baseURL + '/api/' + imgUrl;
}

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

function aumentarQuantidade(cdProduto) {
    const item = cart.getItems().find(i => i.cdProduto === cdProduto);
    if (item) {
        cart.updateQuantity(cdProduto, item.quantidade + 1);
        carregarCarrinho();
    }
}

function diminuirQuantidade(cdProduto) {
    const item = cart.getItems().find(i => i.cdProduto === cdProduto);
    if (item && item.quantidade > 1) {
        cart.updateQuantity(cdProduto, item.quantidade - 1);
        carregarCarrinho();
    }
}

function atualizarQuantidade(cdProduto, quantidade) {
    const qtd = parseInt(quantidade);
    if (qtd > 0) {
        cart.updateQuantity(cdProduto, qtd);
        carregarCarrinho();
    }
}

function removerItem(cdProduto) {
    if (confirm('Deseja remover este item do carrinho?')) {
        cart.removeItem(cdProduto);
        carregarCarrinho();
    }
}

function atualizarResumo() {
    const subtotal = cart.getSubtotal();
    
    document.getElementById('subtotal').textContent = formatarMoeda(subtotal);
    document.getElementById('shipping').textContent = 'Calculado no checkout';
    document.getElementById('total').textContent = formatarMoeda(subtotal);
    
    const freteGratisAlert = document.getElementById('freteGratisAlert');
    if (subtotal >= 200) {
        freteGratisAlert.classList.remove('alert-success');
        freteGratisAlert.classList.add('alert-info');
        freteGratisAlert.innerHTML = '<i class="bi bi-check-circle"></i> Compras acima de R$ 200,00 ganham frete grátis!';
    } else {
        const faltam = 200 - subtotal;
        freteGratisAlert.classList.remove('alert-info');
        freteGratisAlert.classList.add('alert-success');
        freteGratisAlert.innerHTML = `<i class="bi bi-truck"></i> Faltam ${formatarMoeda(faltam)} para frete grátis`;
    }
}

function setupFinalizarPedido() {
    const finalizarButton = document.getElementById('finalizarPedido');
    const modalConfirmar = new bootstrap.Modal(document.getElementById('modalConfirmarPedido'));
    
    finalizarButton.addEventListener('click', () => {
        const items = cart.getItems();
        
        if (items.length === 0) {
            mostrarToast('Seu carrinho está vazio!', 'warning');
            return;
        }
        
        preencherModalConfirmacao(items);
        
        modalConfirmar.show();
    });
    
    document.getElementById('btnConfirmarFinalizar').addEventListener('click', async () => {
        const items = cart.getItems();
        const btnConfirmar = document.getElementById('btnConfirmarFinalizar');
        
        try {
            btnConfirmar.disabled = true;
            btnConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';
            
            // 1. Verificar se usuário está logado
            const user = getLoggedUser();
            if (!user || !user.usuario || !user.usuario.cdUsuario) {
                throw new Error('Você precisa estar logado para finalizar o pedido');
            }
            
            // 2. Baixar estoque de cada item
            for (const item of items) {
                try {
                    await estoqueAPI.baixarEstoque(item.cdProduto, item.quantidade);
                } catch (error) {
                    throw new Error(`Erro ao processar ${item.nmProduto}: ${error.message || 'Estoque insuficiente'}`);
                }
            }
            
            // 3. Criar pedido no banco (backend calcula frete e total automaticamente)
            const pedidoData = {
                cdUsuario: user.usuario.cdUsuario,
                itens: items.map(item => ({
                    cdProduto: item.cdProduto,
                    qtItem: item.quantidade
                }))
            };
            
            const pedidoCriado = await pedidoAPI.criar(pedidoData);
            
            const numeroPedido = pedidoCriado.cdPedido || 'PED' + Date.now();
            const totalPedido = pedidoCriado.vlTotalPedido || 0;
            
            modalConfirmar.hide();
            
            cart.clear();
            
            mostrarSucessoPedido(numeroPedido, items, totalPedido);
            
        } catch (error) {
            mostrarToast('Erro ao finalizar pedido: ' + (error.message || 'Erro desconhecido'), 'error');
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = '<i class="bi bi-check-circle me-2"></i>Confirmar Pedido';
        }
    });
}

function mostrarToast(mensagem, tipo = 'success') {
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
    
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}

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
    document.getElementById('modalTotalPedido').textContent = formatarMoeda(cart.getSubtotal());
}

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
                            Você receberá um e-mail de confirmação em breve.
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
    
    const existingModal = document.getElementById('sucessoModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    const modal = new bootstrap.Modal(document.getElementById('sucessoModal'));
    modal.show();
    
    document.getElementById('sucessoModal').addEventListener('hidden.bs.modal', () => {
        document.getElementById('sucessoModal').remove();
    });
}
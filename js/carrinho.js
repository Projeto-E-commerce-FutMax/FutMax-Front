// Script para página de carrinho
document.addEventListener('DOMContentLoaded', () => {
    carregarCarrinho();
    setupFinalizarPedido();
});

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
        <div class="cart-item d-flex align-items-center gap-3" data-product-id="${item.cdProduto}">
            <div class="cart-item-img bg-light d-flex align-items-center justify-content-center">
                <i class="bi bi-image text-muted" style="font-size: 2rem;"></i>
            </div>
            
            <div class="flex-grow-1">
                <h6 class="fw-bold mb-1">${item.nmProduto}</h6>
                <p class="text-muted small mb-2">${item.dsProduto || ''}</p>
                <p class="fw-bold text-primary mb-0">${formatarMoeda(item.vlProduto)}</p>
            </div>
            
            <div class="quantity-control">
                <button class="quantity-btn" onclick="diminuirQuantidade(${item.cdProduto})">
                    <i class="bi bi-dash"></i>
                </button>
                <input type="number" 
                       class="form-control text-center" 
                       value="${item.quantidade}" 
                       min="1" 
                       style="width: 60px;"
                       onchange="atualizarQuantidade(${item.cdProduto}, this.value)"
                       readonly>
                <button class="quantity-btn" onclick="aumentarQuantidade(${item.cdProduto})">
                    <i class="bi bi-plus"></i>
                </button>
            </div>
            
            <div class="text-end" style="min-width: 100px;">
                <p class="fw-bold mb-1">${formatarMoeda(item.vlProduto * item.quantidade)}</p>
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
    
    finalizarButton.addEventListener('click', async () => {
        const user = localStorage.getItem('futmax_user');
        
        if (!user) {
            const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
            modal.show();
            return;
        }
        
        try {
            const userData = JSON.parse(user);
            const orderData = cart.prepareOrderData(userData.cdUsuario);
            
            // Desabilitar botão durante o processamento
            finalizarButton.disabled = true;
            finalizarButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processando...';
            
            // Enviar pedido para o backend
            const response = await pedidoAPI.criar(orderData);
            
            // Limpar carrinho
            cart.clear();
            
            // Redirecionar para página de sucesso ou exibir modal
            alert(`Pedido realizado com sucesso! Número do pedido: ${response.cdPedido}`);
            window.location.href = 'index.html';
            
        } catch (error) {
            console.error('Erro ao finalizar pedido:', error);
            alert('Erro ao finalizar pedido. Verifique se todos os produtos estão disponíveis em estoque.');
            
            // Reabilitar botão
            finalizarButton.disabled = false;
            finalizarButton.innerHTML = 'Finalizar Pedido';
        }
    });
}
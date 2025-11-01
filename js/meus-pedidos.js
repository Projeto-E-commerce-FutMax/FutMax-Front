document.addEventListener('DOMContentLoaded', async () => {
    // Aguardar um momento para garantir que config.js carregou
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!verificarLogin()) {
        return;
    }
    
    await carregarPedidos();
    updateCartCount();
});

function verificarLogin() {
    const userRaw = localStorage.getItem('futmax_user');
    
    if (!userRaw) {
        alert('Você precisa estar logado para acessar esta página.');
        window.location.href = 'login.html';
        return false;
    }
    
    try {
        const user = JSON.parse(userRaw);
        
        if (!user || !user.usuario || !user.usuario.cdUsuario) {
            alert('Sessão inválida. Por favor, faça login novamente.');
            localStorage.removeItem('futmax_user');
            window.location.href = 'login.html';
            return false;
        }
        
        return true;
    } catch (error) {
        alert('Erro ao verificar sessão. Por favor, faça login novamente.');
        localStorage.removeItem('futmax_user');
        window.location.href = 'login.html';
        return false;
    }
}

async function carregarPedidos() {
    const container = document.getElementById('pedidosContainer');
    const emptyState = document.getElementById('emptyState');
    
    try {
        const userRaw = localStorage.getItem('futmax_user');
        const user = JSON.parse(userRaw);
        
        if (!user || !user.usuario || !user.usuario.cdUsuario) {
            throw new Error('Usuário não identificado');
        }
        
        const pedidos = await pedidoAPI.listarPorUsuario(user.usuario.cdUsuario);
        
        if (!pedidos || pedidos.length === 0) {
            container.classList.add('d-none');
            emptyState.classList.remove('d-none');
            return;
        }
        
        container.classList.remove('d-none');
        emptyState.classList.add('d-none');
        
        // Ordenar pedidos do mais recente para o mais antigo
        const pedidosOrdenados = Array.isArray(pedidos) 
            ? pedidos.sort((a, b) => new Date(b.dtPedido || b.createdAt) - new Date(a.dtPedido || a.createdAt))
            : [];
        
        container.innerHTML = pedidosOrdenados.map(pedido => renderPedido(pedido)).join('');
        
    } catch (error) {
        container.classList.remove('d-none');
        emptyState.classList.add('d-none');
        container.innerHTML = `
            <div class="alert alert-danger">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Erro ao carregar pedidos</strong><br>
                ${error.message || 'Erro desconhecido'}
            </div>
        `;
    }
}

function renderPedido(pedido) {
    const dataPedido = pedido.dtPedido || pedido.createdAt || new Date().toISOString();
    const dataFormatada = new Date(dataPedido).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const statusBadge = '<span class="badge bg-success">Confirmado</span>';
    const items = pedido.itens || [];
    
    return `
        <div class="card border-0 shadow-sm mb-3">
            <div class="card-header bg-transparent border-bottom py-2">
                <div class="row align-items-center g-2">
                    <div class="col-md-3">
                        <small class="text-muted d-block mb-1">Pedido</small>
                        <div class="fw-bold">#${pedido.cdPedido || pedido.id || 'N/A'}</div>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block mb-1">Data</small>
                        <div class="small">${dataFormatada}</div>
                    </div>
                    <div class="col-md-3">
                        <small class="text-muted d-block mb-1">Total</small>
                        <div class="fw-bold text-primary">${formatarMoeda(pedido.vlTotalPedido || 0)}</div>
                    </div>
                    <div class="col-md-3 text-end">
                        ${statusBadge}
                    </div>
                </div>
            </div>
            <div class="card-body py-2">
                <h6 class="fw-bold mb-2 mt-1">Itens do Pedido</h6>
                ${items.length > 0 ? items.map(item => `
                    <div class="d-flex justify-content-between align-items-start mb-1 pb-1 border-bottom">
                        <div>
                            <div class="fw-semibold small">${item.nmProduto || 'Produto'}</div>
                            <small class="text-muted">Qtd: ${item.qtItem || 1} × ${formatarMoeda(item.vlUnitario || 0)}</small>
                        </div>
                        <div class="fw-bold small">${formatarMoeda(item.vlTotal || 0)}</div>
                    </div>
                `).join('') : '<p class="text-muted mb-0">Nenhum item encontrado</p>'}
                
                <div class="mt-2 pt-2 border-top">
                    <div class="row g-1">
                        <div class="col-md-6">
                            <small class="text-muted d-block">Subtotal: ${formatarMoeda(pedido.vlItens || 0)}</small>
                            <small class="text-muted d-block">Frete: ${pedido.vlFrete === 0 ? 'Grátis' : formatarMoeda(pedido.vlFrete || 0)}</small>
                        </div>
                        <div class="col-md-6 text-end">
                            <div class="fw-bold">Total: <span class="text-primary">${formatarMoeda(pedido.vlTotalPedido || 0)}</span></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function getStatusBadge(status) {
    const statusMap = {
        'CONFIRMADO': { class: 'bg-success', text: 'Confirmado' },
        'PROCESSANDO': { class: 'bg-info', text: 'Processando' },
        'ENVIADO': { class: 'bg-primary', text: 'Enviado' },
        'ENTREGUE': { class: 'bg-success', text: 'Entregue' },
        'CANCELADO': { class: 'bg-danger', text: 'Cancelado' }
    };
    
    const statusInfo = statusMap[status] || { class: 'bg-secondary', text: status || 'Pendente' };
    return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
}

function updateCartCount() {
    const carrinho = JSON.parse(localStorage.getItem('futmax_carrinho') || '[]');
    const totalItens = carrinho.reduce((total, item) => total + item.quantidade, 0);
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = totalItens;
    }
}


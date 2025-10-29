// Gerenciamento do Carrinho de Compras
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
    }

    // Carregar carrinho do localStorage
    loadCart() {
        // Tentar carregar de ambas as chaves para compatibilidade
        const cartData = localStorage.getItem('futmax_carrinho') || localStorage.getItem('futmax_cart');
        return cartData ? JSON.parse(cartData) : [];
    }

    // Salvar carrinho no localStorage
    saveCart() {
        // Salvar em ambas as chaves para compatibilidade
        localStorage.setItem('futmax_carrinho', JSON.stringify(this.cart));
        localStorage.setItem('futmax_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Adicionar produto ao carrinho
    addItem(produto, quantidade = 1) {
        const existingItem = this.cart.find(item => item.cdProduto === produto.cdProduto);

        if (existingItem) {
            existingItem.quantidade += quantidade;
        } else {
            this.cart.push({
                cdProduto: produto.cdProduto,
                nmProduto: produto.nmProduto,
                vlProduto: produto.vlProduto,
                dsProduto: produto.dsProduto || '',
                imgUrl: produto.imgUrl || '',
                quantidade: quantidade
            });
        }

        this.saveCart();
        this.showNotification(`${produto.nmProduto} adicionado ao carrinho!`);
    }

    // Remover produto do carrinho
    removeItem(cdProduto) {
        this.cart = this.cart.filter(item => item.cdProduto !== cdProduto);
        this.saveCart();
    }

    // Atualizar quantidade de um produto
    updateQuantity(cdProduto, quantidade) {
        const item = this.cart.find(item => item.cdProduto === cdProduto);
        if (item) {
            item.quantidade = Math.max(1, quantidade);
            this.saveCart();
        }
    }

    // Obter itens do carrinho
    getItems() {
        return this.cart;
    }

    // Obter quantidade total de itens
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantidade, 0);
    }

    // Calcular subtotal
    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.vlProduto * item.quantidade), 0);
    }

    // Calcular frete
    getShipping() {
        const subtotal = this.getSubtotal();
        return calcularFrete(subtotal);
    }

    // Calcular total
    getTotal() {
        return this.getSubtotal() + this.getShipping();
    }

    // Limpar carrinho
    clear() {
        this.cart = [];
        this.saveCart();
    }

    // Atualizar contador no header
    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount');
        const totalItems = this.getTotalItems();
        
        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    }

    // Preparar dados para envio ao backend
    prepareOrderData(cdUsuario) {
        return {
            cdUsuario: cdUsuario,
            itens: this.cart.map(item => ({
                cdProduto: item.cdProduto,
                qtItem: item.quantidade
            }))
        };
    }

    // Mostrar notificação
    showNotification(message) {
        // Criar elemento de toast se não existir
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

        // Criar toast
        const toastId = 'toast-' + Date.now();
        const toastHTML = `
            <div id="${toastId}" class="toast" role="alert">
                <div class="toast-header">
                    <i class="bi bi-cart-check-fill text-success me-2"></i>
                    <strong class="me-auto">FutMax</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">${message}</div>
            </div>
        `;

        toastContainer.insertAdjacentHTML('beforeend', toastHTML);
        
        const toastElement = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
        toast.show();

        // Remover elemento após fechar
        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

// Instância global do carrinho
const cart = new CartManager();

// Atualizar contador ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});
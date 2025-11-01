class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.updateCartCount();
    }

    loadCart() {
        const cartData = localStorage.getItem('futmax_carrinho') || localStorage.getItem('futmax_cart');
        return cartData ? JSON.parse(cartData) : [];
    }


    saveCart() {
        localStorage.setItem('futmax_carrinho', JSON.stringify(this.cart));
        localStorage.setItem('futmax_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

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

    removeItem(cdProduto) {
        this.cart = this.cart.filter(item => item.cdProduto !== cdProduto);
        this.saveCart();
    }

    updateQuantity(cdProduto, quantidade) {
        const item = this.cart.find(item => item.cdProduto === cdProduto);
        if (item) {
            item.quantidade = Math.max(1, quantidade);
            this.saveCart();
        }
    }

    getItems() {
        return this.cart;
    }

    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantidade, 0);
    }

    getSubtotal() {
        return this.cart.reduce((total, item) => total + (item.vlProduto * item.quantidade), 0);
    }

    clear() {
        this.cart = [];
        this.saveCart();
    }

    updateCartCount() {
        const cartCountElements = document.querySelectorAll('#cartCount');
        const totalItems = this.getTotalItems();

        cartCountElements.forEach(element => {
            element.textContent = totalItems;
            element.style.display = totalItems > 0 ? 'inline-block' : 'none';
        });
    }

    showNotification(message) {
        let toastContainer = document.querySelector('.toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.className = 'toast-container position-fixed bottom-0 end-0 p-3';
            toastContainer.style.zIndex = '9999';
            document.body.appendChild(toastContainer);
        }

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

        toastElement.addEventListener('hidden.bs.toast', () => {
            toastElement.remove();
        });
    }
}

const cart = new CartManager();

document.addEventListener('DOMContentLoaded', () => {
    cart.updateCartCount();
});
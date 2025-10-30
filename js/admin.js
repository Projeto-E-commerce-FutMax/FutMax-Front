document.addEventListener('DOMContentLoaded', async () => {
    await carregarEstatisticas();
    await carregarEstoqueBaixo();
});

async function carregarEstatisticas() {
    try {
        const produtos = await produtoAPI.listar();
        document.getElementById('totalProdutos').textContent = produtos.length;

        const estoques = await estoqueAPI.listar();
        const totalEstoque = estoques.reduce((acc, item) => acc + item.qtEstoque, 0);
        document.getElementById('totalEstoque').textContent = totalEstoque;

        try {
            const usuarios = await usuarioAPI.listar();
            const usuariosAtivos = usuarios.filter(u => u.flAtivo).length;
            document.getElementById('usuariosAtivos').textContent = usuariosAtivos;
        } catch {
            document.getElementById('usuariosAtivos').textContent = '0';
        }

    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

async function carregarEstoqueBaixo() {
    const container = document.getElementById('estoqueBaixo');
    
    try {
        const estoques = await estoqueAPI.listar();
        const estoqueBaixo = estoques.filter(e => e.qtEstoque < 10 && e.flAtivo);

        if (estoqueBaixo.length === 0) {
            container.innerHTML = '<p class="text-muted small text-center py-3">Nenhum produto com estoque baixo</p>';
            return;
        }

        container.innerHTML = estoqueBaixo.map(estoque => `
            <div class="alert alert-warning py-2 px-3 mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong class="small">${estoque.nmProduto}</strong>
                        <p class="mb-0 small text-muted">Estoque: ${estoque.qtEstoque} unidades</p>
                    </div>
                    <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                </div>
            </div>
        `).join('');

    } catch (error) {
        console.error('Erro ao carregar estoque baixo:', error);
        container.innerHTML = '<p class="text-danger small">Erro ao carregar</p>';
    }
}
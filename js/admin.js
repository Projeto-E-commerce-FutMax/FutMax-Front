document.addEventListener('DOMContentLoaded', async () => {
    await carregarEstatisticas();
    await carregarProdutosRecentes();
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
    }
}

async function carregarProdutosRecentes() {
    const tbody = document.querySelector('#tabelaProdutosRecentes tbody');

    if (!tbody) return;

    try {
        const produtos = await produtoAPI.listar();
        const produtosRecentes = produtos.slice(0, 5);

        if (produtosRecentes.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-muted">Nenhum produto cadastrado</td></tr>';
            return;
        }

        tbody.innerHTML = produtosRecentes.map(produto => `
            <tr>
                <td>#${produto.cdProduto}</td>
                <td>${produto.nmProduto}</td>
                <td class="fw-bold">${formatarMoeda(produto.vlProduto)}</td>
                <td>
                    <span class="badge ${produto.flAtivo ? 'bg-success' : 'bg-danger'}">
                        ${produto.flAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        if (tbody) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-danger">Erro ao carregar dados</td></tr>';
        }
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
        container.innerHTML = '<p class="text-danger small">Erro ao carregar</p>';
    }
}
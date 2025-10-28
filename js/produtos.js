document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutosPagina();
    setupFiltrosProdutos();
});

let listaProdutos = [];
let produtosVisiveis = [];

async function carregarProdutosPagina() {
    const grid = document.getElementById('productsGrid');
    const empty = document.getElementById('emptyState');
    try {
        const produtos = await produtoAPI.listar();
        listaProdutos = Array.isArray(produtos) ? produtos : [];
        produtosVisiveis = listaProdutos.filter(p => p.flAtivo);
        renderProdutos();
        document.getElementById('productCount').textContent = `${produtosVisiveis.length} produtos`;
        grid.classList.remove('d-none');
        empty.classList.add('d-none');
    } catch (e) {
        console.error('Erro ao listar produtos:', e);
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
                    ${produto.imgUrl ? `<img src="${API_CONFIG.baseURL}${produto.imgUrl}" alt="${produto.nmProduto}" class="img-fluid" style="max-height:100%;object-fit:contain;">` : `<i class=\"bi bi-image\" style=\"font-size:3rem;\"></i>`}
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="fw-bold mb-1">${produto.nmProduto}</h6>
                    <p class="text-muted small mb-2" style="min-height:40px;">${produto.dsProduto}</p>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div>
                            <div class="fw-bold text-primary">${formatarMoeda(produto.vlProduto)}</div>
                            <div class="text-muted small">${calcularParcelamento(produto.vlProduto)}</div>
                        </div>
                        <button class="btn btn-outline-primary btn-sm" onclick="verProduto(${produto.cdProduto})">
                            Ver
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
    const min = document.getElementById('minPrice');
    const max = document.getElementById('maxPrice');
    const ativos = document.getElementById('filterAtivos');
    const apply = document.getElementById('applyFilters');
    const clear = document.getElementById('clearFilters');

    const applyFilters = () => {
        const termo = (search.value || '').toLowerCase();
        const minVal = parseFloat(min.value) || 0;
        const maxVal = parseFloat(max.value) || Number.MAX_VALUE;
        produtosVisiveis = listaProdutos.filter(p => {
            const okNome = p.nmProduto.toLowerCase().includes(termo);
            const okPreco = p.vlProduto >= minVal && p.vlProduto <= maxVal;
            const okAtivo = !ativos.checked || p.flAtivo;
            return okNome && okPreco && okAtivo;
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
        min.value = 0;
        max.value = 500;
        ativos.checked = true;
        applyFilters();
    });
}


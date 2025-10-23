let todosProdutos = [];
let produtosFiltrados = [];
let produtoEditando = null;

document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutos();
    setupFiltros();
    setupFormulario();
});

// Carregar produtos
async function carregarProdutos() {
    try {
        todosProdutos = await produtoAPI.listar();
        produtosFiltrados = [...todosProdutos];
        exibirProdutos();
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        mostrarErro('Erro ao carregar produtos');
    }
}

// Exibir produtos na tabela
function exibirProdutos() {
    const tbody = document.getElementById('tabelaProdutos');
    
    if (produtosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center py-5 text-muted">Nenhum produto encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = produtosFiltrados.map(produto => `
        <tr>
            <td><strong>#${produto.cdProduto}</strong></td>
            <td>
                <div>
                    <strong>${produto.nmProduto}</strong>
                    <p class="text-muted small mb-0">${produto.dsProduto}</p>
                </div>
            </td>
            <td class="fw-bold">${formatarMoeda(produto.vlProduto)}</td>
            <td>
                <span class="badge ${produto.flAtivo ? 'bg-success' : 'bg-danger'}">
                    ${produto.flAtivo ? 'Ativo' : 'Inativo'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-primary btn-action me-1" onclick="editarProduto(${produto.cdProduto})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                ${produto.flAtivo ? `
                    <button class="btn btn-sm btn-warning btn-action" onclick="desativarProduto(${produto.cdProduto})" title="Desativar">
                        <i class="bi bi-x-circle"></i>
                    </button>
                ` : `
                    <button class="btn btn-sm btn-success btn-action" onclick="reativarProduto(${produto.cdProduto})" title="Reativar">
                        <i class="bi bi-check-circle"></i>
                    </button>
                `}
            </td>
        </tr>
    `).join('');
}

// Abrir modal para novo produto
function abrirModalNovo() {
    produtoEditando = null;
    document.getElementById('modalProdutoTitle').textContent = 'Novo Produto';
    document.getElementById('formProduto').reset();
    document.getElementById('cdProduto').value = '';
    document.getElementById('flAtivo').checked = true;
}

// Editar produto
async function editarProduto(cdProduto) {
    try {
        produtoEditando = await produtoAPI.buscar(cdProduto);
        
        document.getElementById('modalProdutoTitle').textContent = 'Editar Produto';
        document.getElementById('cdProduto').value = produtoEditando.cdProduto;
        document.getElementById('nmProduto').value = produtoEditando.nmProduto;
        document.getElementById('vlProduto').value = produtoEditando.vlProduto;
        document.getElementById('dsProduto').value = produtoEditando.dsProduto;
        document.getElementById('flAtivo').checked = produtoEditando.flAtivo;
        
        const modal = new bootstrap.Modal(document.getElementById('modalProduto'));
        modal.show();
        
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        mostrarToast('Erro ao carregar produto', 'error');
    }
}

// Desativar produto
async function desativarProduto(cdProduto) {
    if (!confirm('Deseja realmente desativar este produto?')) return;
    
    try {
        await produtoAPI.desativar(cdProduto);
        mostrarToast('Produto desativado com sucesso!', 'success');
        await carregarProdutos();
    } catch (error) {
        console.error('Erro ao desativar produto:', error);
        mostrarToast('Erro ao desativar produto', 'error');
    }
}

// Reativar produto
async function reativarProduto(cdProduto) {
    try {
        await produtoAPI.reativar(cdProduto);
        mostrarToast('Produto reativado com sucesso!', 'success');
        await carregarProdutos();
    } catch (error) {
        console.error('Erro ao reativar produto:', error);
        mostrarToast('Erro ao reativar produto', 'error');
    }
}

// Setup formulário
function setupFormulario() {
    const form = document.getElementById('formProduto');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            nmProduto: document.getElementById('nmProduto').value,
            vlProduto: parseFloat(document.getElementById('vlProduto').value),
            dsProduto: document.getElementById('dsProduto').value,
            flAtivo: document.getElementById('flAtivo').checked
        };
        
        try {
            if (produtoEditando) {
                // Atualizar
                await produtoAPI.atualizar(produtoEditando.cdProduto, dados);
                mostrarToast('Produto atualizado com sucesso!', 'success');
            } else {
                // Criar novo
                await produtoAPI.cadastrar(dados);
                mostrarToast('Produto cadastrado com sucesso!', 'success');
            }
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalProduto'));
            modal.hide();
            
            await carregarProdutos();
            
        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            mostrarToast('Erro ao salvar produto: ' + error.message, 'error');
        }
    });
}

// Setup filtros
function setupFiltros() {
    const filtroNome = document.getElementById('filtroNome');
    const filtroStatus = document.getElementById('filtroStatus');
    const filtroOrdenacao = document.getElementById('filtroOrdenacao');
    
    filtroNome.addEventListener('input', aplicarFiltros);
    filtroStatus.addEventListener('change', aplicarFiltros);
    filtroOrdenacao.addEventListener('change', aplicarFiltros);
}

// Aplicar filtros
function aplicarFiltros() {
    const nome = document.getElementById('filtroNome').value.toLowerCase();
    const status = document.getElementById('filtroStatus').value;
    const ordenacao = document.getElementById('filtroOrdenacao').value;
    
    // Filtrar
    produtosFiltrados = todosProdutos.filter(produto => {
        const matchNome = produto.nmProduto.toLowerCase().includes(nome);
        const matchStatus = status === '' || produto.flAtivo.toString() === status;
        return matchNome && matchStatus;
    });
    
    // Ordenar
    switch (ordenacao) {
        case 'nome':
            produtosFiltrados.sort((a, b) => a.nmProduto.localeCompare(b.nmProduto));
            break;
        case 'preco-asc':
            produtosFiltrados.sort((a, b) => a.vlProduto - b.vlProduto);
            break;
        case 'preco-desc':
            produtosFiltrados.sort((a, b) => b.vlProduto - a.vlProduto);
            break;
        case 'recente':
            produtosFiltrados.sort((a, b) => b.cdProduto - a.cdProduto);
            break;
    }
    
    exibirProdutos();
}

// Limpar filtros
function limparFiltros() {
    document.getElementById('filtroNome').value = '';
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroOrdenacao').value = 'nome';
    aplicarFiltros();
}

// Mostrar toast
function mostrarToast(mensagem, tipo = 'success') {
    const toastEl = document.getElementById('toast');
    const toastIcon = document.getElementById('toastIcon');
    const toastMessage = document.getElementById('toastMessage');
    
    toastIcon.className = tipo === 'success' 
        ? 'bi bi-check-circle-fill text-success me-2'
        : 'bi bi-exclamation-circle-fill text-danger me-2';
    
    toastMessage.textContent = mensagem;
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
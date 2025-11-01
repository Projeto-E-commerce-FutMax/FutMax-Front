let todosProdutos = [];
let produtosFiltrados = [];
let produtoEditando = null;

document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutos();
    setupFiltros();
    setupFormulario();
});

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

function exibirProdutos() {
    const tbody = document.getElementById('tabelaProdutos');

    if (produtosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-muted">Nenhum produto encontrado</td></tr>';
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
            <td>
                <span class="badge bg-info">${produto.nmCategoria || 'N/A'}</span>
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

function abrirModalNovo() {
    produtoEditando = null;
    document.getElementById('modalProdutoTitle').textContent = 'Novo Produto';
    document.getElementById('formProduto').reset();
    document.getElementById('cdProduto').value = '';
    document.getElementById('flAtivo').checked = true;
    document.getElementById('nmCategoria').value = '';
    const preview = document.getElementById('previewImagem');
    if (preview) {
        preview.src = '';
        preview.classList.add('d-none');
    }
}

async function editarProduto(cdProduto) {
    try {
        produtoEditando = await produtoAPI.buscar(cdProduto);

        document.getElementById('modalProdutoTitle').textContent = 'Editar Produto';
        document.getElementById('cdProduto').value = produtoEditando.cdProduto;
        document.getElementById('nmProduto').value = produtoEditando.nmProduto;
        document.getElementById('vlProduto').value = produtoEditando.vlProduto;
        document.getElementById('dsProduto').value = produtoEditando.dsProduto;
        document.getElementById('flAtivo').checked = produtoEditando.flAtivo;
        document.getElementById('nmCategoria').value = produtoEditando.nmCategoria || '';

        const modal = new bootstrap.Modal(document.getElementById('modalProduto'));
        modal.show();

    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        mostrarToast('Erro ao carregar produto', 'error');
    }
}

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

function setupFormulario() {
    const form = document.getElementById('formProduto');
    const inputImagem = document.getElementById('imagemProduto');

    if (inputImagem) {
        inputImagem.addEventListener('change', (e) => {
            const file = e.target.files && e.target.files[0];
            const preview = document.getElementById('previewImagem');

            if (file) {
                if (file.size > 5 * 1024 * 1024) {
                    alert('Arquivo muito grande. Máximo 5MB.');
                    e.target.value = '';
                    return;
                }

                if (!file.type.startsWith('image/')) {
                    alert('Apenas arquivos de imagem são permitidos.');
                    e.target.value = '';
                    return;
                }

                if (preview) {
                    preview.src = URL.createObjectURL(file);
                    preview.classList.remove('d-none');
                }
            }
        });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nmProduto = document.getElementById('nmProduto').value;
        const vlProduto = parseFloat(document.getElementById('vlProduto').value);
        const dsProduto = document.getElementById('dsProduto').value;
        const flAtivo = document.getElementById('flAtivo').checked;
        const nmCategoria = document.getElementById('nmCategoria').value;
        const imagem = inputImagem && inputImagem.files ? inputImagem.files[0] : null;

        try {
            const fd = new FormData();
            fd.append('nmProduto', nmProduto);
            fd.append('vlProduto', vlProduto);
            fd.append('dsProduto', dsProduto);
            fd.append('flAtivo', flAtivo);
            fd.append('nmCategoria', nmCategoria);
            if (imagem) {
                fd.append('imagem', imagem);
            }

            if (produtoEditando) {
                await produtoAPI.atualizar(produtoEditando.cdProduto, fd);
                mostrarToast('Produto atualizado com sucesso!', 'success');
            } else {
                await produtoAPI.cadastrar(fd);
                mostrarToast('Produto cadastrado com sucesso!', 'success');
            }

            const modal = bootstrap.Modal.getInstance(document.getElementById('modalProduto'));
            modal.hide();

            await carregarProdutos();

        } catch (error) {
            console.error('Erro ao salvar produto:', error);
            console.error('Detalhes do erro:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
            mostrarToast('Erro ao salvar produto: ' + error.message, 'error');
        }
    });
}

function setupFiltros() {
    const filtroNome = document.getElementById('filtroNome');
    const filtroCategoria = document.getElementById('filtroCategoria');
    const filtroStatus = document.getElementById('filtroStatus');
    const filtroOrdenacao = document.getElementById('filtroOrdenacao');

    filtroNome.addEventListener('input', aplicarFiltros);
    filtroCategoria.addEventListener('change', aplicarFiltros);
    filtroStatus.addEventListener('change', aplicarFiltros);
    filtroOrdenacao.addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    const nome = document.getElementById('filtroNome').value.toLowerCase();
    const categoria = document.getElementById('filtroCategoria').value;
    const status = document.getElementById('filtroStatus').value;
    const ordenacao = document.getElementById('filtroOrdenacao').value;

    produtosFiltrados = todosProdutos.filter(produto => {
        const matchNome = produto.nmProduto.toLowerCase().includes(nome);
        const matchCategoria = categoria === '' || (produto.nmCategoria && produto.nmCategoria === categoria);
        const matchStatus = status === '' || produto.flAtivo.toString() === status;
        return matchNome && matchCategoria && matchStatus;
    });

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

function limparFiltros() {
    document.getElementById('filtroNome').value = '';
    document.getElementById('filtroCategoria').value = '';
    document.getElementById('filtroStatus').value = '';
    document.getElementById('filtroOrdenacao').value = 'nome';
    aplicarFiltros();
}

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
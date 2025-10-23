let todosEstoques = [];
let estoquesFiltrados = [];
let todosProdutos = [];

document.addEventListener('DOMContentLoaded', async () => {
    await carregarProdutos();
    await carregarEstoques();
    setupFiltros();
    setupFormularios();
});

// Carregar produtos para o select
async function carregarProdutos() {
    try {
        todosProdutos = await produtoAPI.listar();
        const select = document.getElementById('cdProduto');
        
        const produtosAtivos = todosProdutos.filter(p => p.flAtivo);
        select.innerHTML = '<option value="">Selecione um produto...</option>' +
            produtosAtivos.map(p => 
                `<option value="${p.cdProduto}">${p.nmProduto} - ${formatarMoeda(p.vlProduto)}</option>`
            ).join('');
            
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

async function carregarEstoques() {
    try {
        todosEstoques = await estoqueAPI.listar();
        estoquesFiltrados = [...todosEstoques];
        exibirEstoques();
        atualizarContadores();
    } catch (error) {
        console.error('Erro ao carregar estoques:', error);
        mostrarErro('Erro ao carregar estoques');
    }
}

function exibirEstoques() {
    const tbody = document.getElementById('tabelaEstoque');
    
    if (estoquesFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-5 text-muted">Nenhum estoque encontrado</td></tr>';
        return;
    }

    tbody.innerHTML = estoquesFiltrados.map(estoque => {
        const nivel = estoque.qtEstoque === 0 ? 'zerado' : 
                     estoque.qtEstoque < 10 ? 'baixo' : 'normal';
        const badgeNivel = nivel === 'zerado' ? 'badge-nivel-zerado' :
                          nivel === 'baixo' ? 'badge-nivel-baixo' : 'badge-nivel-normal';
        const textoNivel = nivel === 'zerado' ? 'Sem Estoque' :
                          nivel === 'baixo' ? 'Baixo' : 'Normal';
        
        return `
            <tr>
                <td><strong>#${estoque.cdEstoque}</strong></td>
                <td>
                    <div>
                        <strong>${estoque.nmProduto}</strong>
                        <p class="text-muted small mb-0">ID Produto: #${estoque.cdProduto}</p>
                    </div>
                </td>
                <td class="fw-bold fs-5">${estoque.qtEstoque}</td>
                <td>
                    <span class="badge ${badgeNivel}">${textoNivel}</span>
                </td>
                <td>
                    <span class="badge ${estoque.flAtivo ? 'bg-success' : 'bg-danger'}">
                        ${estoque.flAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-primary btn-action me-1" 
                            onclick="abrirAjusteRapido(${estoque.cdEstoque}, '${estoque.nmProduto}', ${estoque.qtEstoque})" 
                            title="Ajuste Rápido">
                        <i class="bi bi-pencil"></i> Ajustar
                    </button>
                    ${estoque.flAtivo ? `
                        <button class="btn btn-sm btn-warning btn-action" 
                                onclick="desativarEstoque(${estoque.cdEstoque})" 
                                title="Desativar">
                            <i class="bi bi-x-circle"></i>
                        </button>
                    ` : `
                        <button class="btn btn-sm btn-success btn-action" 
                                onclick="reativarEstoque(${estoque.cdEstoque})" 
                                title="Reativar">
                            <i class="bi bi-check-circle"></i>
                        </button>
                    `}
                </td>
            </tr>
        `;
    }).join('');
}

// Atualizar contadores
function atualizarContadores() {
    const estoqueBaixo = todosEstoques.filter(e => e.qtEstoque > 0 && e.qtEstoque < 10 && e.flAtivo).length;
    const estoqueNormal = todosEstoques.filter(e => e.qtEstoque >= 10 && e.flAtivo).length;
    const semEstoque = todosEstoques.filter(e => e.qtEstoque === 0 && e.flAtivo).length;
    
    document.getElementById('countEstoqueBaixo').textContent = estoqueBaixo;
    document.getElementById('countEstoqueNormal').textContent = estoqueNormal;
    document.getElementById('countSemEstoque').textContent = semEstoque;
}

// Abrir modal novo
function abrirModalNovo() {
    document.getElementById('modalEstoqueTitle').textContent = 'Adicionar Estoque';
    document.getElementById('formEstoque').reset();
    document.getElementById('cdEstoque').value = '';
}

// Abrir ajuste rápido
function abrirAjusteRapido(cdEstoque, nomeProduto, quantidadeAtual) {
    document.getElementById('cdEstoqueAjuste').value = cdEstoque;
    document.getElementById('nomeProdutoAjuste').textContent = nomeProduto;
    document.getElementById('estoqueAtualAjuste').textContent = quantidadeAtual;
    document.getElementById('novaQuantidade').value = quantidadeAtual;
    
    const modal = new bootstrap.Modal(document.getElementById('modalAjuste'));
    modal.show();
}

// Desativar estoque
async function desativarEstoque(cdEstoque) {
    if (!confirm('Deseja realmente desativar este estoque?')) return;
    
    try {
        await apiRequest(`/estoque/desativar/${cdEstoque}`, 'DELETE');
        mostrarToast('Estoque desativado com sucesso!', 'success');
        await carregarEstoques();
    } catch (error) {
        console.error('Erro ao desativar estoque:', error);
        mostrarToast('Erro ao desativar estoque', 'error');
    }
}

async function reativarEstoque(cdEstoque) {
    try {
        await apiRequest(`/estoque/reativar/${cdEstoque}`, 'PUT');
        mostrarToast('Estoque reativado com sucesso!', 'success');
        await carregarEstoques();
    } catch (error) {
        console.error('Erro ao reativar estoque:', error);
        mostrarToast('Erro ao reativar estoque', 'error');
    }
}

function setupFormularios() {
    const formEstoque = document.getElementById('formEstoque');
    formEstoque.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            qtEstoque: parseInt(document.getElementById('qtEstoque').value),
            cdProduto: parseInt(document.getElementById('cdProduto').value)
        };
        
        try {
            await estoqueAPI.cadastrar(dados);
            mostrarToast('Estoque adicionado com sucesso!', 'success');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalEstoque'));
            modal.hide();
            
            await carregarEstoques();
            
        } catch (error) {
            console.error('Erro ao adicionar estoque:', error);
            mostrarToast('Erro ao adicionar estoque: ' + error.message, 'error');
        }
    });
    
    const formAjuste = document.getElementById('formAjuste');
    formAjuste.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const cdEstoque = parseInt(document.getElementById('cdEstoqueAjuste').value);
        const novaQuantidade = parseInt(document.getElementById('novaQuantidade').value);
        
        const estoque = todosEstoques.find(e => e.cdEstoque === cdEstoque);
        
        const dados = {
            qtEstoque: novaQuantidade,
            cdProduto: estoque.cdProduto
        };
        
        try {
            await estoqueAPI.atualizar(cdEstoque, dados);
            mostrarToast('Estoque atualizado com sucesso!', 'success');
            
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalAjuste'));
            modal.hide();
            
            await carregarEstoques();
            
        } catch (error) {
            console.error('Erro ao atualizar estoque:', error);
            mostrarToast('Erro ao atualizar estoque: ' + error.message, 'error');
        }
    });
}

function setupFiltros() {
    const filtroProduto = document.getElementById('filtroProduto');
    const filtroNivelEstoque = document.getElementById('filtroNivelEstoque');
    const filtroStatus = document.getElementById('filtroStatus');
    
    filtroProduto.addEventListener('input', aplicarFiltros);
    filtroNivelEstoque.addEventListener('change', aplicarFiltros);
    filtroStatus.addEventListener('change', aplicarFiltros);
}

function aplicarFiltros() {
    const textoProduto = document.getElementById('filtroProduto').value.toLowerCase();
    const nivelEstoque = document.getElementById('filtroNivelEstoque').value;
    const status = document.getElementById('filtroStatus').value;
    
    estoquesFiltrados = todosEstoques.filter(estoque => {
        const matchProduto = estoque.nmProduto.toLowerCase().includes(textoProduto);
        
        let matchNivel = true;
        if (nivelEstoque === 'baixo') matchNivel = estoque.qtEstoque > 0 && estoque.qtEstoque < 10;
        if (nivelEstoque === 'normal') matchNivel = estoque.qtEstoque >= 10;
        if (nivelEstoque === 'zerado') matchNivel = estoque.qtEstoque === 0;
        
        const matchStatus = status === '' || estoque.flAtivo.toString() === status;
        
        return matchProduto && matchNivel && matchStatus;
    });
    
    exibirEstoques();
}

function limparFiltros() {
    document.getElementById('filtroProduto').value = '';
    document.getElementById('filtroNivelEstoque').value = '';
    document.getElementById('filtroStatus').value = '';
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
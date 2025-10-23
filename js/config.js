const API_CONFIG = {
    baseURL: 'http://localhost:8089/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};

const API_ENDPOINTS = {
    // Autenticação
    auth: {
        login: '/auth/login'
    },
    // Produtos
    produtos: {
        listar: '/produto/buscar/todos',
        buscar: (id) => `/produto/buscar/${id}`,
        cadastrar: '/produto/cadastrar',
        atualizar: (id) => `/produto/atualizar/${id}`,
        desativar: (id) => `/produto/desativar/${id}`,
        reativar: (id) => `/produto/reativar/${id}`
    },
    // Usuários
    usuarios: {
        cadastrar: '/usuarios/cadastrar',
        listar: '/usuarios/buscar/todos',
        desativar: (id) => `/usuarios/desativar/${id}`,
        reativar: (id) => `/usuarios/reativar/${id}`
    },
    // Pedidos
    pedidos: {
        criar: '/pedidos/cadastrar',
        buscar: (id) => `/pedidos/buscar/${id}`,
        listar: '/pedidos/buscar/todos',
        itens: (id) => `/pedidos/${id}/itens`
    },
    // Estoque
    estoque: {
        listar: '/estoque/buscar/todos',
        buscar: (id) => `/estoque/buscar/${id}`,
        cadastrar: '/estoque/cadastrar',
        atualizar: (id) => `/estoque/atualizar/${id}`,
        desativar: (id) => `/estoque/desativar/${id}`,
        reativar: (id) => `/estoque/reativar/${id}`
    },
    // Roles
    roles: {
        listar: '/role/buscar/todos',
        buscar: (id) => `/role/buscar/${id}`,
        cadastrar: '/role/cadastrar',
        atualizar: (id) => `/role/atualizar/${id}`,
        deletar: (id) => `/role/deletar/${id}`
    }
};

// Função para obter o token JWT do localStorage
function getAuthToken() {
    const user = localStorage.getItem('futmax_user');
    if (user) {
        try {
            const userData = JSON.parse(user);
            return userData.token;
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Função principal para fazer requisições à API
async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = true) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const options = {
        method,
        headers: { ...API_CONFIG.headers }
    };

    // Adicionar token JWT se necessário
    if (requiresAuth) {
        const token = getAuthToken();
        console.log('🔑 Token sendo enviado:', token); // DEBUG
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    console.log('📡 Fazendo requisição:', { url, method, headers: options.headers }); // DEBUG

    try {
        const response = await fetch(url, options);
        
        console.log('📥 Resposta recebida:', response.status); // DEBUG
        
        // Se não autorizado, redirecionar para login
        if (response.status === 401 || response.status === 403) {
            console.error('❌ Não autorizado! Status:', response.status); // DEBUG
            localStorage.removeItem('futmax_user');
            if (window.location.pathname !== '/html/login.html' && window.location.pathname !== '/login.html') {
                window.location.href = '/html/login.html';
            }
            throw new Error('Não autorizado');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Erro na resposta:', errorData); // DEBUG
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        const responseData = await response.json();
        console.log('✅ Dados recebidos:', responseData); // DEBUG
        return responseData;
        
    } catch (error) {
        console.error('💥 API Error:', error);
        throw error;
    }
}

// API de Autenticação
const authAPI = {
    login: async (credentials) => {
        return apiRequest(API_ENDPOINTS.auth.login, 'POST', credentials, false);
    }
};

// API de Produtos
const produtoAPI = {
    listar: () => apiRequest(API_ENDPOINTS.produtos.listar, 'GET', null, false),
    buscar: (id) => apiRequest(API_ENDPOINTS.produtos.buscar(id), 'GET', null, false),
    cadastrar: (data) => apiRequest(API_ENDPOINTS.produtos.cadastrar, 'POST', data, true),
    atualizar: (id, data) => apiRequest(API_ENDPOINTS.produtos.atualizar(id), 'PUT', data, true),
    desativar: (id) => apiRequest(API_ENDPOINTS.produtos.desativar(id), 'DELETE', null, true),
    reativar: (id) => apiRequest(API_ENDPOINTS.produtos.reativar(id), 'PUT', null, true)
};

// API de Usuários
const usuarioAPI = {
    cadastrar: (data) => apiRequest(API_ENDPOINTS.usuarios.cadastrar, 'POST', data, false),
    listar: () => apiRequest(API_ENDPOINTS.usuarios.listar, 'GET', null, true),
    desativar: (id) => apiRequest(API_ENDPOINTS.usuarios.desativar(id), 'DELETE', null, true),
    reativar: (id) => apiRequest(API_ENDPOINTS.usuarios.reativar(id), 'PUT', null, true)
};

// API de Pedidos
const pedidoAPI = {
    criar: (data) => apiRequest(API_ENDPOINTS.pedidos.criar, 'POST', data, true),
    buscar: (id) => apiRequest(API_ENDPOINTS.pedidos.buscar(id), 'GET', null, true),
    listar: () => apiRequest(API_ENDPOINTS.pedidos.listar, 'GET', null, true),
    buscarItens: (id) => apiRequest(API_ENDPOINTS.pedidos.itens(id), 'GET', null, true)
};

// API de Estoque
const estoqueAPI = {
    listar: () => apiRequest(API_ENDPOINTS.estoque.listar, 'GET', null, false),
    buscar: (id) => apiRequest(API_ENDPOINTS.estoque.buscar(id), 'GET', null, false),
    cadastrar: (data) => apiRequest(API_ENDPOINTS.estoque.cadastrar, 'POST', data, true),
    atualizar: (id, data) => apiRequest(API_ENDPOINTS.estoque.atualizar(id), 'PUT', data, true)
};

// Funções utilitárias
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function calcularFrete(vlItens) {
    if (vlItens >= 200.0) {
        return 0.0;
    } else if (vlItens >= 100.0) {
        return 10.0;
    } else {
        return 20.0;
    }
}

// Calcular parcelamento
function calcularParcelamento(valor, parcelas = 12) {
    const valorParcela = valor / parcelas;
    return `${parcelas}x de ${formatarMoeda(valorParcela)} sem juros`;
}

// Validação de CPF
function validarCPF(cpf) {
    cpf = cpf.replace(/[^\d]/g, '');
    
    if (cpf.length !== 11) return false;
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

// Máscara para CPF
function mascaraCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

// Máscara para telefone
function mascaraTelefone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

// Exibir toast de notificação
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('notificationToast');
    if (!toastEl) return;
    
    const toastBody = document.getElementById('toastMessage');
    const toastIcon = toastEl.querySelector('.toast-header i');
    
    toastBody.textContent = message;
    
    // Alterar ícone baseado no tipo
    toastIcon.className = type === 'success' 
        ? 'bi bi-check-circle-fill text-success me-2'
        : 'bi bi-exclamation-circle-fill text-danger me-2';
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

// Alternar visualização de senha
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    }
}
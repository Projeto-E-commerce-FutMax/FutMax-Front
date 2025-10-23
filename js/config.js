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

// ===== FUNÇÕES DE AUTENTICAÇÃO =====

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

// Função para obter dados do usuário logado
function getLoggedUser() {
    const user = localStorage.getItem('futmax_user');
    if (user) {
        try {
            return JSON.parse(user);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// Verificar se o usuário está logado
function isLoggedIn() {
    const token = getAuthToken();
    if (!token) return false;
    
    // Verificar se o token está expirado
    if (isTokenExpired()) {
        logout();
        return false;
    }
    
    return true;
}

// Verificar se o usuário é admin
function isAdmin() {
    const userData = getLoggedUser();
    if (!userData || !userData.usuario || !userData.usuario.roleModels) {
        return false;
    }
    return userData.usuario.roleModels.some(role => 
        role.nmRole === 'ROLE_ADMIN' || role.nmRole === 'ADMIN'
    );
}

// Fazer logout
function logout() {
    localStorage.removeItem('futmax_user');
    localStorage.removeItem('futmax_cart');
    window.location.href = '/html/login.html';
}

// Verificar expiração do token
function isTokenExpired() {
    const userData = getLoggedUser();
    if (!userData || !userData.token) return true;
    
    try {
        // Decodificar JWT (payload é a segunda parte)
        const payload = JSON.parse(atob(userData.token.split('.')[1]));
        const expiry = payload.exp * 1000; // converter para milissegundos
        return Date.now() >= expiry;
    } catch (e) {
        return true;
    }
}

// ===== REQUISIÇÕES À API =====

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
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Se requer auth mas não tem token, redirecionar para login
            window.location.href = '/html/login.html';
            throw new Error('Não autenticado');
        }
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        
        // Se não autorizado, fazer logout e redirecionar
        if (response.status === 401 || response.status === 403) {
            console.error('❌ Não autorizado! Token expirado ou inválido');
            logout();
            throw new Error('Não autorizado');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        return await response.json();
        
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

// ===== FUNÇÕES UTILITÁRIAS =====

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
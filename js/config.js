const API_CONFIG = {
    baseURL: 'http://localhost:8089/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
};

const API_ENDPOINTS = {
    auth: {
        login: '/auth/login'
    },
    produtos: {
        listar: '/produto/buscar/todos',
        buscar: (id) => `/produto/buscar/${id}`,
        cadastrar: '/produto/cadastrar',
        atualizar: (id) => `/produto/atualizar/${id}`,
        desativar: (id) => `/produto/desativar/${id}`,
        reativar: (id) => `/produto/reativar/${id}`
    },
    usuarios: {
        cadastrar: '/usuarios/cadastrar',
        listar: '/usuarios/buscar/todos',
        desativar: (id) => `/usuarios/desativar/${id}`,
        reativar: (id) => `/usuarios/reativar/${id}`
    },
    estoque: {
        listar: '/estoque/buscar/todos',
        buscarPorProduto: (id) => `/estoque/produto/${id}`,
        baixarEstoque: (cdProduto, quantidade) => `/estoque/baixar-estoque-ficticio/${cdProduto}?quantidade=${quantidade}`,
        cadastrar: '/estoque/cadastrar',
        atualizar: (id) => `/estoque/atualizar/${id}`,
        desativar: (id) => `/estoque/desativar/${id}`,
        reativar: (id) => `/estoque/reativar/${id}`
    }
};

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

function getLoggedUser() {
    const raw = localStorage.getItem('futmax_user');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

function isLoggedIn() {
    const data = getLoggedUser();
    return !!(data && data.token);
}

function isAdmin() {
    const data = getLoggedUser();
    if (!data || !data.usuario) return false;
    const roles = Array.isArray(data.usuario.roleModels)
        ? data.usuario.roleModels.map(r => r.nmRole || r)
        : [];
    return roles.some(r => String(r).includes('ADMIN'));
}

async function apiRequest(endpoint, method = 'GET', data = null, requiresAuth = true) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const options = {
        method,
        headers: { ...API_CONFIG.headers }
    };

    if (requiresAuth) {
        const token = getAuthToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
        }
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(url, options);
        
        if (response.status === 401 || response.status === 403) {
            console.error('❌ Não autorizado! Status:', response.status);
            localStorage.removeItem('futmax_user');
            const currentPath = window.location.pathname;
            if (!currentPath.includes('login.html')) {
                window.location.href = 'login.html';
            }
            throw new Error('Não autorizado');
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('❌ Erro na resposta:', errorData);
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        const responseData = await response.json();
        return responseData;
        
    } catch (error) {
        console.error('💥 API Error:', error);
        throw error;
    }
}

async function apiRequestMultipart(endpoint, method = 'POST', formData, requiresAuth = true) {
    const url = `${API_CONFIG.baseURL}${endpoint}`;
    const options = { method, headers: {} };
    if (requiresAuth) {
        const token = getAuthToken();
        if (token) options.headers['Authorization'] = `Bearer ${token}`;
    }
    options.body = formData;

    const response = await fetch(url, options);
    
    if (response.status === 401 || response.status === 403) {
        console.error('❌ Não autorizado! Status:', response.status);
        localStorage.removeItem('futmax_user');
        window.location.href = 'login.html';
        throw new Error('Não autorizado');
    }
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Erro na resposta multipart:', errorData);
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    return response.json();
}

const authAPI = {
    login: async (credentials) => {
        return apiRequest(API_ENDPOINTS.auth.login, 'POST', credentials, false);
    }
};

const produtoAPI = {
    listar: () => apiRequest(API_ENDPOINTS.produtos.listar, 'GET', null, false),
    buscar: (id) => apiRequest(API_ENDPOINTS.produtos.buscar(id), 'GET', null, false),
    cadastrar: (formData) => apiRequestMultipart(API_ENDPOINTS.produtos.cadastrar, 'POST', formData, true),
    atualizar: (id, formData) => apiRequestMultipart(API_ENDPOINTS.produtos.atualizar(id), 'PUT', formData, true),
    desativar: (id) => apiRequest(API_ENDPOINTS.produtos.desativar(id), 'DELETE', null, true),
    reativar: (id) => apiRequest(API_ENDPOINTS.produtos.reativar(id), 'PUT', null, true)
};

const usuarioAPI = {
    cadastrar: (data) => apiRequest(API_ENDPOINTS.usuarios.cadastrar, 'POST', data, false),
    listar: () => apiRequest(API_ENDPOINTS.usuarios.listar, 'GET', null, true),
    desativar: (id) => apiRequest(API_ENDPOINTS.usuarios.desativar(id), 'DELETE', null, true),
    reativar: (id) => apiRequest(API_ENDPOINTS.usuarios.reativar(id), 'PUT', null, true)
};

const estoqueAPI = {
    listar: () => apiRequest(API_ENDPOINTS.estoque.listar, 'GET', null, true),
    baixarEstoque: (cdProduto, quantidade) => apiRequest(API_ENDPOINTS.estoque.baixarEstoque(cdProduto, quantidade), 'PUT', null, false),
    cadastrar: (data) => apiRequest(API_ENDPOINTS.estoque.cadastrar, 'POST', data, true),
    atualizar: (id, data) => apiRequest(API_ENDPOINTS.estoque.atualizar(id), 'PUT', data, true),
    desativar: (id) => apiRequest(API_ENDPOINTS.estoque.desativar(id), 'DELETE', null, true),
    reativar: (id) => apiRequest(API_ENDPOINTS.estoque.reativar(id), 'PUT', null, true)
};

function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
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

// Verificar se usuário está logado e atualizar UI
function checkUserLogin() {
    const user = localStorage.getItem('futmax_user');
    const userButton = document.getElementById('userButton');
    
    if (user && userButton) {
        const userData = JSON.parse(user);
        userButton.innerHTML = `
            <i class="bi bi-person-circle"></i> 
            <span class="d-none d-lg-inline">${userData.usuario.nmUsuario.split(' ')[0]}</span>
        `;
        userButton.href = '#';
        userButton.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('Deseja sair?')) {
                localStorage.removeItem('futmax_user');
                window.location.reload();
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', checkUserLogin);
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
        baixarEstoque: (cdProduto, quantidade) => `/estoque/baixar-estoque/${cdProduto}?quantidade=${quantidade}`,
        cadastrar: '/estoque/cadastrar',
        atualizar: (id) => `/estoque/atualizar/${id}`,
        desativar: (id) => `/estoque/desativar/${id}`,
        reativar: (id) => `/estoque/reativar/${id}`
    },
    pedidos: {
        criar: '/pedidos/cadastrar',
        listarPorUsuario: (cdUsuario) => `/pedidos/usuario/${cdUsuario}`,
        buscar: (id) => `/pedidos/buscar/${id}`,
        listar: '/pedidos/buscar/todos'
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
            throw new Error('Não autorizado - Status: ' + response.status);
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
        }

        if (response.status === 204) {
            return null;
        }

        const responseData = await response.json();
        return responseData;
        
    } catch (error) {
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
        localStorage.removeItem('futmax_user');
        window.location.href = 'login.html';
        throw new Error('Não autorizado');
    }
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
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
    buscarPorProduto: (id) => apiRequest(API_ENDPOINTS.estoque.buscarPorProduto(id), 'GET', null, false),
    baixarEstoque: (cdProduto, quantidade) => apiRequest(API_ENDPOINTS.estoque.baixarEstoque(cdProduto, quantidade), 'PUT', null, false),
    cadastrar: (data) => apiRequest(API_ENDPOINTS.estoque.cadastrar, 'POST', data, true),
    atualizar: (id, data) => apiRequest(API_ENDPOINTS.estoque.atualizar(id), 'PUT', data, true),
    desativar: (id) => apiRequest(API_ENDPOINTS.estoque.desativar(id), 'DELETE', null, true),
    reativar: (id) => apiRequest(API_ENDPOINTS.estoque.reativar(id), 'PUT', null, true)
};

const pedidoAPI = {
    criar: (data) => apiRequest(API_ENDPOINTS.pedidos.criar, 'POST', data, true),
    listarPorUsuario: (cdUsuario) => apiRequest(API_ENDPOINTS.pedidos.listarPorUsuario(cdUsuario), 'GET', null, true),
    buscar: (id) => apiRequest(API_ENDPOINTS.pedidos.buscar(id), 'GET', null, true),
    listar: () => apiRequest(API_ENDPOINTS.pedidos.listar, 'GET', null, true)
};

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

function calcularParcelamento(valor, parcelas = 12) {
    const valorParcela = valor / parcelas;
    return `${parcelas}x de ${formatarMoeda(valorParcela)} sem juros`;
}

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

function mascaraCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

function mascaraTelefone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
}

function showToast(message, type = 'success') {
    const toastEl = document.getElementById('notificationToast');
    if (!toastEl) return;
    
    const toastBody = document.getElementById('toastMessage');
    const toastIcon = toastEl.querySelector('.toast-header i');
    
    toastBody.textContent = message;
    
    toastIcon.className = type === 'success' 
        ? 'bi bi-check-circle-fill text-success me-2'
        : 'bi bi-exclamation-circle-fill text-danger me-2';
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

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

function checkUserLogin() {
    const user = localStorage.getItem('futmax_user');
    const userButton = document.getElementById('userButton');
    
    if (user && userButton) {
        const userData = JSON.parse(user);
        const primeiroNome = userData.usuario.nmUsuario.split(' ')[0];
        
        userButton.innerHTML = `
            <i class="bi bi-person-circle"></i> 
            <span class="d-none d-lg-inline">${primeiroNome}</span>
        `;
        userButton.href = '#';
        userButton.classList.add('dropdown-toggle');
        userButton.setAttribute('data-bs-toggle', 'dropdown');
        userButton.setAttribute('aria-expanded', 'false');
        
        const adminMenuItem = isAdmin() 
            ? '<li><a class="dropdown-item" href="admin.html"><i class="bi bi-shield-lock me-2"></i>Administração</a></li><li><hr class="dropdown-divider"></li>' 
            : '';
        
        const dropdownMenu = document.createElement('ul');
        dropdownMenu.className = 'dropdown-menu dropdown-menu-end';
        dropdownMenu.innerHTML = `
            ${adminMenuItem}
            <li><a class="dropdown-item" href="meus-pedidos.html"><i class="bi bi-bag me-2"></i>Meus Pedidos</a></li>
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item text-danger" href="#" id="logoutBtn"><i class="bi bi-box-arrow-right me-2"></i>Sair</a></li>
        `;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'dropdown';
        userButton.parentNode.insertBefore(wrapper, userButton);
        wrapper.appendChild(userButton);
        wrapper.appendChild(dropdownMenu);
        
        setTimeout(() => {
            document.getElementById('logoutBtn')?.addEventListener('click', logout);
        }, 100);
    }
}

function logout(event) {
    event.preventDefault();
    if (confirm('Deseja sair?')) {
        localStorage.removeItem('futmax_user');
        window.location.href = 'index.html';
    }
}

document.addEventListener('DOMContentLoaded', checkUserLogin);
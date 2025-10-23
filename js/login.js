// Script para página de login
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se já está logado
    if (isLoggedIn()) {
        redirecionarUsuario();
        return;
    }
    
    setupLoginForm();
    setupRegisterForm();
    setupMasks();
});

// Redirecionar usuário baseado na role
function redirecionarUsuario() {
    const urlParams = new URLSearchParams(window.location.search);
    const returnUrl = urlParams.get('return');
    
    if (isAdmin()) {
        window.location.href = returnUrl || '/html/admin.html';
    } else {
        window.location.href = returnUrl || '/html/index.html';
    }
}

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Desabilitar botão e mostrar loading
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Entrando...';
        
        const formData = new FormData(form);
        const data = {
            nmEmail: formData.get('nmEmail'),
            nmSenha: formData.get('nmSenha')
        };
        
        try {
            // Fazer login usando o endpoint correto
            const response = await authAPI.login(data);
            
            console.log('✅ Login bem-sucedido:', response);
            
            // Verificar se o usuário está ativo
            if (!response.usuario.flAtivo) {
                showToast('Usuário inativo. Entre em contato com o suporte.', 'error');
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
                return;
            }
            
            // Salvar token e dados do usuário no localStorage
            localStorage.setItem('futmax_user', JSON.stringify(response));
            
            showToast('Login realizado com sucesso!', 'success');
            
            // Redirecionar após 500ms
            setTimeout(() => {
                redirecionarUsuario();
            }, 500);
            
        } catch (error) {
            console.error('❌ Erro no login:', error);
            
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            
            // Mensagens de erro mais específicas
            if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                showToast('E-mail ou senha incorretos', 'error');
            } else if (error.message.includes('403')) {
                showToast('Acesso negado', 'error');
            } else {
                showToast('Erro ao fazer login. Tente novamente.', 'error');
            }
        }
    });
}

// Configurar formulário de cadastro
function setupRegisterForm() {
    const form = document.getElementById('registerForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        // Desabilitar botão e mostrar loading
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Cadastrando...';
        
        const formData = new FormData(form);
        
        // Validar senha
        const senha = formData.get('nmSenha');
        if (!validarSenha(senha)) {
            showToast('A senha deve conter: maiúscula, minúscula, número e caractere especial', 'error');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            return;
        }
        
        // Validar CPF
        const cpf = formData.get('nmCpf').replace(/\D/g, '');
        if (!validarCPF(cpf)) {
            showToast('CPF inválido', 'error');
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            return;
        }
        
        const data = {
            nmUsuario: formData.get('nmUsuario'),
            nmEmail: formData.get('nmEmail'),
            nmCpf: cpf,
            nmSenha: senha,
            nmTelefone: formData.get('nmTelefone').replace(/\D/g, ''),
            nmEndereco: formData.get('nmEndereco'),
            dsEndereco: formData.get('dsEndereco') || '',
            flAtivo: true
        };
        
        try {
            await usuarioAPI.cadastrar(data);
            
            showToast('Cadastro realizado com sucesso! Fazendo login...', 'success');
            
            // Fazer login automaticamente após cadastro
            const loginResponse = await authAPI.login({
                nmEmail: data.nmEmail,
                nmSenha: data.nmSenha
            });
            
            localStorage.setItem('futmax_user', JSON.stringify(loginResponse));
            
            // Redirecionar após 500ms
            setTimeout(() => {
                window.location.href = '/html/index.html';
            }, 500);
            
        } catch (error) {
            console.error('❌ Erro no cadastro:', error);
            
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
            
            if (error.message.includes('CPF')) {
                showToast('CPF já cadastrado', 'error');
            } else if (error.message.includes('email') || error.message.includes('e-mail') || error.message.includes('E-mail')) {
                showToast('E-mail já cadastrado', 'error');
            } else {
                showToast('Erro ao realizar cadastro. Verifique os dados e tente novamente.', 'error');
            }
        }
    });
}

// Configurar máscaras
function setupMasks() {
    // Máscara CPF
    const cpfInputs = document.querySelectorAll('input[name="nmCpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = mascaraCPF(e.target.value);
        });
    });
    
    // Máscara Telefone
    const telInputs = document.querySelectorAll('input[name="nmTelefone"]');
    telInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = mascaraTelefone(e.target.value);
        });
    });
}

// Validar senha forte
function validarSenha(senha) {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,}$/;
    return regex.test(senha);
}

// Exibir toast
function showToast(message, type = 'success') {
    const toastEl = document.getElementById('notificationToast');
    if (!toastEl) return;
    
    const toastBody = document.getElementById('toastMessage');
    const toastIcon = toastEl.querySelector('.toast-header i');
    
    toastBody.textContent = message;
    
    if (type === 'success') {
        toastIcon.className = 'bi bi-check-circle-fill text-success me-2';
    } else {
        toastIcon.className = 'bi bi-exclamation-circle-fill text-danger me-2';
    }
    
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}
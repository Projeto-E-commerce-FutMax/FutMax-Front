// Script para página de login
document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupRegisterForm();
    setupMasks();
});

function setupLoginForm() {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            nmEmail: formData.get('nmEmail'),
            nmSenha: formData.get('nmSenha')
        };
        
        try {
            // Fazer login usando o endpoint correto
            const response = await authAPI.login(data);
            
            console.log('Login bem-sucedido:', response);
            
            // Verificar se o usuário está ativo
            if (!response.usuario.flAtivo) {
                showToast('Usuário inativo. Entre em contato com o suporte.', 'error');
                return;
            }
            
            // Salvar token e dados do usuário no localStorage
            localStorage.setItem('futmax_user', JSON.stringify(response));
            
            showToast('Login realizado com sucesso!', 'success');
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
                window.location.href = returnUrl;
            }, 1000);
            
        } catch (error) {
            console.error('Erro no login:', error);
            
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
        
        const formData = new FormData(form);
        
        // Validar senha
        const senha = formData.get('nmSenha');
        if (!validarSenha(senha)) {
            showToast('A senha deve conter: maiúscula, minúscula, número e caractere especial', 'error');
            return;
        }
        
        // Validar CPF
        const cpf = formData.get('nmCpf').replace(/\D/g, '');
        if (!validarCPF(cpf)) {
            showToast('CPF inválido', 'error');
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
            const response = await usuarioAPI.cadastrar(data);
            
            showToast('Cadastro realizado com sucesso!', 'success');
            
            // Fazer login automaticamente
            localStorage.setItem('futmax_user', JSON.stringify(response));
            
            // Redirecionar após 1 segundo
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
            
        } catch (error) {
            console.error('Erro no cadastro:', error);
            
            if (error.message.includes('CPF')) {
                showToast('CPF já cadastrado', 'error');
            } else if (error.message.includes('email')) {
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
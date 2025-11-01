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
            const response = await authAPI.login(data);

            console.log('Login bem-sucedido:', response);

            if (!response.usuario.flAtivo) {
                showToast('Usuário inativo. Entre em contato com o suporte.', 'error');
                return;
            }

            localStorage.setItem('futmax_user', JSON.stringify(response));

            showToast('Login realizado com sucesso!', 'success');

            setTimeout(() => {
                const roles = (response.usuario && response.usuario.roleModels) ? Array.from(response.usuario.roleModels).map(r => r.nmRole || r) : [];
                const isAdmin = roles.some(r => String(r).includes('ADMIN'));
                if (isAdmin) {
                    window.location.href = 'admin.html';
                    return;
                }
                const returnUrl = new URLSearchParams(window.location.search).get('return') || 'index.html';
                window.location.href = returnUrl;
            }, 1000);

        } catch (error) {
            console.error('Erro no login:', error);

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


function setupRegisterForm() {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const senha = formData.get('nmSenha');
        if (!validarSenha(senha)) {
            showToast('A senha deve conter: maiúscula, minúscula, número e caractere especial', 'error');
            return;
        }

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

            localStorage.setItem('futmax_user', JSON.stringify(response));

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

function setupMasks() {
    const cpfInputs = document.querySelectorAll('input[name="nmCpf"]');
    cpfInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = mascaraCPF(e.target.value);
        });
    });

    const telInputs = document.querySelectorAll('input[name="nmTelefone"]');
    telInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            e.target.value = mascaraTelefone(e.target.value);
        });
    });
}

function validarSenha(senha) {
    const regex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).{6,}$/;
    return regex.test(senha);
}

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
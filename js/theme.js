// Gerenciamento de Tema Claro/Escuro
class ThemeManager {
    constructor() {
        this.theme = this.loadTheme();
        this.applyTheme();
        this.setupToggleButton();
    }

    // Carregar tema salvo ou usar tema do sistema
    loadTheme() {
        const savedTheme = localStorage.getItem('futmax_theme');
        if (savedTheme) {
            return savedTheme;
        }
        // Detectar preferência do sistema
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Salvar tema
    saveTheme() {
        localStorage.setItem('futmax_theme', this.theme);
    }

    // Aplicar tema ao body e elementos principais
    applyTheme() {
        const body = document.body;
        
        if (this.theme === 'dark') {
            body.classList.add('dark-theme');
            
            // Adicionar classe aos elementos que precisam de tema escuro
            this.applyDarkThemeToElements();
        } else {
            body.classList.remove('dark-theme');
        }
        
        this.updateToggleIcon();
    }

    // Aplicar tema escuro a elementos específicos
    applyDarkThemeToElements() {
        // Selecionar todos os elementos que precisam de ajuste
        const elementsToUpdate = [
            '.navbar',
            '.card',
            '.modal-content',
            '.bg-light',
            '.bg-white',
            '.footer-custom'
        ];

        elementsToUpdate.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                // Adicionar atributo para forçar o estilo
                el.setAttribute('data-theme', 'dark');
            });
        });
    }

    // Alternar tema
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.saveTheme();
        this.applyTheme();
        
        // Adicionar animação suave
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Atualizar ícone do botão
    updateToggleIcon() {
        const toggleButtons = document.querySelectorAll('#themeToggle i');
        toggleButtons.forEach(icon => {
            if (this.theme === 'dark') {
                icon.classList.remove('bi-moon-fill');
                icon.classList.add('bi-sun-fill');
            } else {
                icon.classList.remove('bi-sun-fill');
                icon.classList.add('bi-moon-fill');
            }
        });

        // Atualizar título do botão
        const buttons = document.querySelectorAll('#themeToggle');
        buttons.forEach(button => {
            button.setAttribute('title', 
                this.theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
            );
        });
    }

    // Configurar botão de alternância
    setupToggleButton() {
        const toggleButtons = document.querySelectorAll('#themeToggle');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        });
    }

    // Observar mudanças no DOM para aplicar tema em novos elementos
    observeDOM() {
        const observer = new MutationObserver((mutations) => {
            if (this.theme === 'dark') {
                this.applyDarkThemeToElements();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// Inicializar tema ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    themeManager.observeDOM();
});

// Detectar mudança na preferência do sistema
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Só mudar automaticamente se o usuário não tiver definido preferência manual
        if (!localStorage.getItem('futmax_theme')) {
            const themeManager = new ThemeManager();
        }
    });
}
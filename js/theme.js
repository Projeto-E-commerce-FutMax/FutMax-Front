// Gerenciamento de Tema Claro/Escuro
class ThemeManager {
    constructor() {
        this.theme = this.loadTheme();
        this.applyTheme();
        this.setupToggleButton();
    }

    // Carregar tema do localStorage
    loadTheme() {
        return localStorage.getItem('futmax_theme') || 'light';
    }

    // Salvar tema no localStorage
    saveTheme() {
        localStorage.setItem('futmax_theme', this.theme);
    }

    // Aplicar tema
    applyTheme() {
        if (this.theme === 'dark') {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
        this.updateToggleIcon();
    }

    // Alternar tema
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.saveTheme();
        this.applyTheme();
    }

    // Atualizar ícone do botão
    updateToggleIcon() {
        const toggleButtons = document.querySelectorAll('#themeToggle i');
        toggleButtons.forEach(icon => {
            if (this.theme === 'dark') {
                icon.classList.replace('bi-moon-fill', 'bi-sun-fill');
            } else {
                icon.classList.replace('bi-sun-fill', 'bi-moon-fill');
            }
        });
    }

    // Configurar botão de alternância
    setupToggleButton() {
        const toggleButtons = document.querySelectorAll('#themeToggle');
        toggleButtons.forEach(button => {
            button.addEventListener('click', () => this.toggleTheme());
        });
    }
}

// Inicializar tema ao carregar
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
});
class ThemeManager {
    constructor() {
        this.theme = this.loadTheme();
        this.applyTheme();
        this.setupToggleButton();
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('futmax_theme');
        if (savedTheme) {
            return savedTheme;
        }
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    saveTheme() {
        localStorage.setItem('futmax_theme', this.theme);
    }

    applyTheme() {
        const html = document.documentElement;
        const body = document.body;

        if (this.theme === 'dark') {
            html.setAttribute('data-bs-theme', 'dark');
            body.setAttribute('data-bs-theme', 'dark');

            const nav = document.querySelector('nav[data-bs-theme="light"]');
            if (nav) {
                nav.removeAttribute('data-bs-theme');
            }
        } else {
            html.setAttribute('data-bs-theme', 'light');
            body.setAttribute('data-bs-theme', 'light');

            const nav = document.querySelector('nav.navbar');
            if (nav && !nav.hasAttribute('data-bs-theme')) {
                nav.setAttribute('data-bs-theme', 'light');
            }
        }

        this.updateToggleIcon();
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.saveTheme();
        this.applyTheme();

        document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        setTimeout(() => {
            document.documentElement.style.transition = '';
        }, 300);
    }

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

        const buttons = document.querySelectorAll('#themeToggle');
        buttons.forEach(button => {
            button.setAttribute('title',
                this.theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'
            );
        });
    }

    setupToggleButton() {
        const toggleButtons = document.querySelectorAll('#themeToggle');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
});

if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('futmax_theme')) {
            const themeManager = new ThemeManager();
        }
    });
}
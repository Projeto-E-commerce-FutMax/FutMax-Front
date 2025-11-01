(function () {
    'use strict';

    if (!isLoggedIn()) {
        console.warn('⚠️ Usuário não autenticado. Redirecionando para login...');
        const currentPage = window.location.pathname;
        window.location.href = `login.html?return=${encodeURIComponent(currentPage)}`;
        return;
    }

    if (window.location.pathname.includes('admin') && !isAdmin()) {
        console.warn('⚠️ Usuário sem permissão de admin. Redirecionando...');
        alert('Você não tem permissão para acessar esta página.');
        window.location.href = 'index.html';
        return;
    }

    const userData = getLoggedUser();
    if (userData && userData.usuario) {
        const adminNameElements = document.querySelectorAll('#adminName');
        adminNameElements.forEach(element => {
            element.textContent = userData.usuario.nmUsuario.split(' ')[0];
        });
    }

    console.log('✅ Autenticação verificada com sucesso');
})();
// Authentication Management
function getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

function saveUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
}

function login(email) {
    const user = {
        email: email,
        name: email.split('@')[0]
    };
    saveUser(user);
    return user;
}

function register(email, name) {
    const user = {
        email: email,
        name: name
    };
    saveUser(user);
    return user;
}

function logout() {
    localStorage.removeItem('user');
    showToast('Logout realizado com sucesso!');
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

function isLoggedIn() {
    return getUser() !== null;
}

/**
 * Authentication Module
 * Gerencia login, registro e logout de usuários
 */

/**
 * Exibe o formulário de login
 */
function showLogin() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registerForm').classList.add('hidden');
}

/**
 * Exibe o formulário de registro
 */
function showRegister() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registerForm').classList.remove('hidden');
}

/**
 * Realiza o login do usuário
 */
function login() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!username || !password) {
        showAlert('Atenção', 'Por favor, preencha todos os campos');
        return;
    }

    const result = db.authenticateUser(username, password);

    if (result.success) {
        document.getElementById('authScreen').classList.add('hidden');
        document.getElementById('mainApp').classList.remove('hidden');
        document.getElementById('userName').textContent = result.user.name;
        initializeApp();
    } else {
        showAlert('Erro', result.message);
    }
}

/**
 * Registra um novo usuário
 */
function register() {
    const name = document.getElementById('registerName').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;

    if (!name || !username || !password) {
        showAlert('Atenção', 'Por favor, preencha todos os campos');
        return;
    }

    if (username.length < 3) {
        showAlert('Atenção', 'O usuário deve ter pelo menos 3 caracteres');
        return;
    }

    if (password.length < 4) {
        showAlert('Atenção', 'A senha deve ter pelo menos 4 caracteres');
        return;
    }

    const result = db.createUser(name, username, password);

    if (result.success) {
        showAlert('Sucesso', 'Conta criada com sucesso! Faça login para continuar');
        showLogin();
        document.getElementById('registerName').value = '';
        document.getElementById('registerUsername').value = '';
        document.getElementById('registerPassword').value = '';
    } else {
        showAlert('Erro', result.message);
    }
}

/**
 * Desloga o usuário atual
 */
function logout() {
    showConfirmDialog('Sair', 'Tem certeza que deseja sair?', (confirmed) => {
        if (confirmed) {
            db.logout();
            document.getElementById('authScreen').classList.remove('hidden');
            document.getElementById('mainApp').classList.add('hidden');
            document.getElementById('loginUsername').value = '';
            document.getElementById('loginPassword').value = '';
        }
    });

}
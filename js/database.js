/**
 * Database Module
 * Gerencia o banco de dados local e operações de usuário
 */

class Database {
    constructor() {
        this.currentUser = null;
    }

    /**
     * Obtém lista de todos os usuários
     * @returns {Array} Lista de usuários
     */
    getUsers() {
        return JSON.parse(storage.getItem('taskflow_users') || '[]');
    }

    /**
     * Salva lista de usuários
     * @param {Array} users - Lista de usuários
     */
    saveUsers(users) {
        storage.setItem('taskflow_users', JSON.stringify(users));
    }

    /**
     * Obtém dados de um usuário específico
     * @param {string} username - Nome do usuário
     * @returns {Object} Dados do usuário
     */
    getUserData(username) {
        return JSON.parse(
            storage.getItem(`taskflow_data_${username}`) || 
            '{"boards": [], "currentBoardId": null}'
        );
    }

    /**
     * Salva dados de um usuário
     * @param {string} username - Nome do usuário
     * @param {Object} data - Dados a salvar
     */
    saveUserData(username, data) {
        storage.setItem(`taskflow_data_${username}`, JSON.stringify(data));
    }

    /**
     * Cria um novo usuário
     * @param {string} name - Nome completo
     * @param {string} username - Nome de usuário
     * @param {string} password - Senha
     * @returns {Object} Resultado da operação
     */
    createUser(name, username, password) {
        const users = this.getUsers();
        
        if (users.find(u => u.username === username)) {
            return { success: false, message: 'Usuário já existe' };
        }

        users.push({ 
            name, 
            username, 
            password, 
            createdAt: new Date().toISOString() 
        });
        
        this.saveUsers(users);

        // Inicializa dados do usuário
        this.saveUserData(username, {
            boards: [],
            currentBoardId: null
        });

        console.log(`[Database] Usuário criado: ${username}`);
        return { success: true };
    }

    /**
     * Autentica um usuário
     * @param {string} username - Nome de usuário
     * @param {string} password - Senha
     * @returns {Object} Resultado da autenticação
     */
    authenticateUser(username, password) {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            this.currentUser = user;
            console.log(`[Database] Usuário autenticado: ${username}`);
            return { success: true, user };
        }

        return { success: false, message: 'Usuário ou senha incorretos' };
    }

    /**
     * Obtém dados do usuário atual
     * @returns {Object|null} Dados do usuário ou null
     */
    getCurrentUserData() {
        if (!this.currentUser) return null;
        return this.getUserData(this.currentUser.username);
    }

    /**
     * Salva dados do usuário atual
     * @param {Object} data - Dados a salvar
     */
    saveCurrentUserData(data) {
        if (!this.currentUser) return;
        this.saveUserData(this.currentUser.username, data);
    }

    /**
     * Desloga o usuário atual
     */
    logout() {
        console.log(`[Database] Usuário deslogado: ${this.currentUser?.username}`);
        this.currentUser = null;
    }
}

// Exporta instância única
const db = new Database();
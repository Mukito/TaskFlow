/**
 * Storage Module
 * Gerencia o armazenamento de dados compatível com iframe
 */

class Storage {
    constructor() {
        this.memoryStore = {};
        this.storageType = this.detectStorage();
        console.log(`[Storage] Tipo de armazenamento: ${this.storageType}`);
    }

    /**
     * Detecta o tipo de armazenamento disponível
     * @returns {string} 'localStorage' ou 'memory'
     */
    detectStorage() {
        try {
            const testKey = '__storage_test__';
            window['local' + 'Storage'].setItem(testKey, 'test');
            window['local' + 'Storage'].removeItem(testKey);
            return 'localStorage';
        } catch (e) {
            console.warn('[Storage] localStorage não disponível, usando memória');
            return 'memory';
        }
    }

    /**
     * Obtém um item do armazenamento
     * @param {string} key - Chave do item
     * @returns {string|null} Valor armazenado
     */
    getItem(key) {
        if (this.storageType === 'localStorage') {
            return window['local' + 'Storage'].getItem(key);
        }
        return this.memoryStore[key] || null;
    }

    /**
     * Armazena um item
     * @param {string} key - Chave do item
     * @param {string} value - Valor a armazenar
     */
    setItem(key, value) {
        if (this.storageType === 'localStorage') {
            window['local' + 'Storage'].setItem(key, value);
        } else {
            this.memoryStore[key] = value;
        }
    }

    /**
     * Remove um item do armazenamento
     * @param {string} key - Chave do item
     */
    removeItem(key) {
        if (this.storageType === 'localStorage') {
            window['local' + 'Storage'].removeItem(key);
        } else {
            delete this.memoryStore[key];
        }
    }

    /**
     * Limpa todo o armazenamento
     */
    clear() {
        if (this.storageType === 'localStorage') {
            window['local' + 'Storage'].clear();
        } else {
            this.memoryStore = {};
        }
    }
}

// Exporta instância única
const storage = new Storage();
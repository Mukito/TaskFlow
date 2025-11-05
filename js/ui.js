/**
 * UI Module
 * Funções de interface do usuário (dialogs, alerts, etc)
 */

let confirmCallback = null;

/**
 * Exibe um alerta customizado
 * @param {string} title - Título do alerta
 * @param {string} message - Mensagem do alerta
 */
function showAlert(title, message) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 modal-overlay p-4';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm slide-in">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">${escapeHtml(title)}</h3>
            <p class="text-base text-gray-600 dark:text-gray-400 mb-6">${escapeHtml(message)}</p>
            <div class="flex justify-end">
                <button onclick="this.closest('.fixed').remove()"
                        class="btn-primary px-4 py-2 rounded-lg font-semibold text-base">
                    OK
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

/**
 * Exibe um diálogo de confirmação
 * @param {string} title - Título do diálogo
 * @param {string} message - Mensagem do diálogo
 * @param {Function} callback - Função a ser chamada com o resultado (true/false)
 */
function showConfirmDialog(title, message, callback) {
    confirmCallback = callback;
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmDialog').classList.remove('hidden');
}

/**
 * Fecha o diálogo de confirmação
 * @param {boolean} confirmed - Se o usuário confirmou ou cancelou
 */
function closeConfirmDialog(confirmed) {
    document.getElementById('confirmDialog').classList.add('hidden');
    if (confirmCallback) {
        confirmCallback(confirmed);
        confirmCallback = null;
    }
}

/**
 * Escapa HTML para prevenir XSS
 * @param {string} text - Texto a ser escapado
 * @returns {string} Texto escapado
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Gera um ID único
 * @returns {string} ID único
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Inicializa o dark mode
 */
function initializeDarkMode() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
    }

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (event.matches) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    });
}

/**
 * Inicializa os seletores de cores
 */
function initializeColorPickers() {
    // Color picker para tarefas
    const taskColorOptions = document.querySelectorAll('#taskModal .color-option');
    taskColorOptions.forEach(option => {
        option.addEventListener('click', () => {
            taskColorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedTaskColor = option.dataset.color === 'none' ? null : option.dataset.color;
        });
    });

    // Color picker para listas
    const listColorOptions = document.querySelectorAll('#listModal .color-option');
    listColorOptions.forEach(option => {
        option.addEventListener('click', () => {
            listColorOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            selectedListColor = option.dataset.color === 'none' ? null : option.dataset.color;
        });
    });
}
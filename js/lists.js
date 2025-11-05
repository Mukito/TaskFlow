/**
 * Lists Module
 * Gerencia operações relacionadas a listas
 */

let editingListId = null;
let selectedListColor = null;

/**
 * Renderiza uma lista no quadro
 * @param {Object} list - Objeto da lista
 */
function renderList(list) {
    const listsContainer = document.getElementById('listsContainer');

    const listElement = document.createElement('div');
    listElement.className = 'list-container bg-gray-100 dark:bg-gray-800 rounded-lg p-4 flex-shrink-0';
    listElement.dataset.listId = list.id;

    const tasksHtml = list.tasks.map(task => {
        const textColor = task.color ? 'text-gray-800 dark:text-gray-900' : 'text-gray-800 dark:text-white';
        const descColor = task.color ? 'text-gray-700 dark:text-gray-800' : 'text-gray-600 dark:text-gray-400';

        return `
            <div class="p-3 rounded-lg shadow-sm mb-2 cursor-pointer card-hover ${task.color ? '' : 'bg-white dark:bg-gray-700'}"
                 style="${task.color ? `background-color: ${task.color}` : ''}"
                 draggable="true"
                 data-task-id="${task.id}"
                 onclick="showTaskDetails('${list.id}', '${task.id}')"
                 oncontextmenu="showTaskContextMenu(event, '${list.id}', '${task.id}')">
                <h4 class="font-medium ${textColor} text-base mb-1">${escapeHtml(task.title)}</h4>
                ${task.description ? `<p class="text-sm ${descColor} line-clamp-2">${escapeHtml(task.description)}</p>` : ''}
            </div>
        `;
    }).join('');

    const listColorClass = list.color ? `list-color-${list.color}` : '';

    listElement.innerHTML = `
        <div class="list-header ${listColorClass} -mx-4 -mt-4 mb-3 px-4 pt-4 pb-3">
            <div class="flex justify-between items-center">
                <h3 class="font-semibold text-gray-800 dark:text-white text-base">${escapeHtml(list.name)}</h3>
                <div class="flex space-x-1">
                    <button onclick="editList('${list.id}')" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 p-1" title="Editar lista">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    <button onclick="deleteList('${list.id}')" class="text-gray-500 hover:text-red-600 dark:hover:text-red-400 p-1" title="Excluir lista">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        <div class="tasks-container mb-3 max-h-96 overflow-y-auto scrollbar-hide" data-list-id="${list.id}">
            ${tasksHtml}
        </div>
        <button onclick="showAddTaskModal('${list.id}')"
                class="w-full text-left px-3 py-2 text-base text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition">
            + Adicionar Tarefa
        </button>
    `;

    listsContainer.appendChild(listElement);

    // Adicionar eventos de drag and drop
    const tasksContainer = listElement.querySelector('.tasks-container');
    tasksContainer.addEventListener('dragover', handleDragOver);
    tasksContainer.addEventListener('drop', handleDrop);
    tasksContainer.addEventListener('dragleave', handleDragLeave);

    listElement.querySelectorAll('[draggable="true"]').forEach(task => {
        task.addEventListener('dragstart', handleDragStart);
        task.addEventListener('dragend', handleDragEnd);
    });
}

/**
 * Exibe modal para adicionar nova lista
 */
function showAddListModal() {
    editingListId = null;
    selectedListColor = null;
    document.getElementById('listModalTitle').textContent = 'Nova Lista';
    document.getElementById('listNameInput').value = '';

    // Reset color selection
    const colorOptions = document.querySelectorAll('#listModal .color-option');
    colorOptions.forEach(opt => opt.classList.remove('selected'));
    colorOptions[0]?.classList.add('selected');

    document.getElementById('listModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('listNameInput').focus(), 100);
}

/**
 * Edita uma lista existente
 * @param {string} listId - ID da lista
 */
function editList(listId) {
    const userData = db.getCurrentUserData();
    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    if (!list) return;

    editingListId = listId;
    selectedListColor = list.color;

    document.getElementById('listModalTitle').textContent = 'Editar Lista';
    document.getElementById('listNameInput').value = list.name;

    // Set color selection
    const colorOptions = document.querySelectorAll('#listModal .color-option');
    colorOptions.forEach(opt => {
        opt.classList.remove('selected');
        if (list.color && opt.dataset.color === list.color) {
            opt.classList.add('selected');
        } else if (!list.color && opt.dataset.color === 'none') {
            opt.classList.add('selected');
        }
    });

    document.getElementById('listModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('listNameInput').focus(), 100);
}

/**
 * Fecha o modal de lista
 */
function closeListModal() {
    document.getElementById('listModal').classList.add('hidden');
    editingListId = null;
    selectedListColor = null;
}

/**
 * Salva uma lista (nova ou editada)
 */
function saveList() {
    const name = document.getElementById('listNameInput').value.trim();

    if (!name) {
        showAlert('Atenção', 'Por favor, insira um nome para a lista');
        return;
    }

    const userData = db.getCurrentUserData();
    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    if (editingListId) {
        // Editar lista existente
        const list = board.lists.find(l => l.id === editingListId);
        if (list) {
            list.name = name;
            list.color = selectedListColor;
            console.log(`[Lists] Lista editada: ${name}`);
        }
    } else {
        // Criar nova lista
        const newList = {
            id: generateId(),
            name: name,
            color: selectedListColor,
            tasks: [],
            createdAt: new Date().toISOString()
        };
        board.lists.push(newList);
        console.log(`[Lists] Lista criada: ${name}`);
    }

    db.saveCurrentUserData(userData);
    loadBoard();
    closeListModal();
}

/**
 * Exclui uma lista
 * @param {string} listId - ID da lista
 */
function deleteList(listId) {
    showConfirmDialog('Excluir Lista', 'Tem certeza que deseja excluir esta lista e todas as suas tarefas?', (confirmed) => {
        if (confirmed) {
            const userData = db.getCurrentUserData();
            const board = userData.boards.find(b => b.id === currentBoardId);
            if (board) {
                const listName = board.lists.find(l => l.id === listId)?.name;
                board.lists = board.lists.filter(l => l.id !== listId);
                db.saveCurrentUserData(userData);
                loadBoard();
                console.log(`[Lists] Lista excluída: ${listName}`);
            }
        }
    });
}
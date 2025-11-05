/**
 * Tasks Module
 * Gerencia operações relacionadas a tarefas
 */

let currentListId = null;
let currentTaskId = null;
let editingTaskId = null;
let selectedTaskColor = null;

/**
 * Exibe modal para adicionar nova tarefa
 * @param {string} listId - ID da lista
 */
function showAddTaskModal(listId) {
    currentListId = listId;
    editingTaskId = null;
    selectedTaskColor = null;

    document.getElementById('taskModalTitle').textContent = 'Nova Tarefa';
    document.getElementById('taskTitleInput').value = '';
    document.getElementById('taskDescriptionInput').value = '';

    // Reset color selection
    const colorOptions = document.querySelectorAll('#taskModal .color-option');
    colorOptions.forEach(opt => opt.classList.remove('selected'));
    colorOptions[0]?.classList.add('selected');

    document.getElementById('taskModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('taskTitleInput').focus(), 100);
}

/**
 * Fecha o modal de tarefa
 */
function closeTaskModal() {
    document.getElementById('taskModal').classList.add('hidden');
    currentListId = null;
    editingTaskId = null;
    selectedTaskColor = null;
}

/**
 * Salva uma tarefa (nova ou editada)
 */
function saveTask() {
    const title = document.getElementById('taskTitleInput').value.trim();
    const description = document.getElementById('taskDescriptionInput').value.trim();

    if (!title) {
        showAlert('Atenção', 'Por favor, insira um título para a tarefa');
        return;
    }

    const userData = db.getCurrentUserData();
    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === currentListId);
    if (!list) return;

    if (editingTaskId) {
        // Editar tarefa existente
        const task = list.tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.title = title;
            task.description = description;
            task.color = selectedTaskColor;
            console.log(`[Tasks] Tarefa editada: ${title}`);
        }
    } else {
        // Criar nova tarefa
        const newTask = {
            id: generateId(),
            title: title,
            description: description,
            color: selectedTaskColor,
            createdAt: new Date().toISOString()
        };
        list.tasks.push(newTask);
        console.log(`[Tasks] Tarefa criada: ${title}`);
    }

    db.saveCurrentUserData(userData);
    loadBoard();
    closeTaskModal();
}

/**
 * Exibe detalhes de uma tarefa
 * @param {string} listId - ID da lista
 * @param {string} taskId - ID da tarefa
 */
function showTaskDetails(listId, taskId) {
    const userData = db.getCurrentUserData();
    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === listId);
    if (!list) return;

    const task = list.tasks.find(t => t.id === taskId);
    if (!task) return;

    currentListId = listId;
    currentTaskId = taskId;

    document.getElementById('taskDetailsTitle').textContent = task.title;
    document.getElementById('taskDetailsDescription').textContent = task.description || 'Sem descrição';

    // Preencher seletor de quadros/listas
    const selectBoard = document.getElementById('moveToBoardSelect');
    selectBoard.innerHTML = `<option value="">Selecione um quadro...</option>`;

    userData.boards.forEach(b => {
        if (b.id !== currentBoardId) {
            b.lists.forEach(l => {
                const option = document.createElement('option');
                option.value = `${b.id}|${l.id}`;
                option.textContent = `${b.name} → ${l.name}`;
                selectBoard.appendChild(option);
            });
        }
    });

    selectBoard.onchange = () => {
        if (selectBoard.value) {
            const [targetBoardId, targetListId] = selectBoard.value.split('|');
            moveTaskToDifferentBoard(taskId, listId, currentBoardId, targetBoardId, targetListId);
        }
    };

    // Preencher seletor de listas do quadro atual
    const selectList = document.getElementById('moveToListSelect');
    selectList.innerHTML = `<option value="">Mover para lista...</option>`;

    board.lists.forEach(l => {
        if (l.id !== listId) {
            const option = document.createElement('option');
            option.value = l.id;
            option.textContent = l.name;
            selectList.appendChild(option);
        }
    });

    selectList.onchange = () => {
        if (selectList.value) {
            moveTaskToList(taskId, listId, selectList.value, -1);
            closeTaskDetailsModal();
        }
    };

    document.getElementById('taskDetailsModal').classList.remove('hidden');
}

/**
 * Fecha o modal de detalhes da tarefa
*/
function closeTaskDetailsModal() {
    document.getElementById('taskDetailsModal').classList.add('hidden');
    currentListId = null;
    currentTaskId = null;
}

/**
 * Edita a tarefa a partir do modal de detalhes
*/
function editTaskFromDetails() {
    const userData = db.getCurrentUserData();
    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    const list = board.lists.find(l => l.id === currentListId);
    if (!list) return;

    const task = list.tasks.find(t => t.id === currentTaskId);
    if (!task) return;

    editingTaskId = currentTaskId;
    selectedTaskColor = task.color;

    document.getElementById('taskModalTitle').textContent = 'Editar Tarefa';
    document.getElementById('taskTitleInput').value = task.title;
    document.getElementById('taskDescriptionInput').value = task.description;

    // Set color selection
    const colorOptions = document.querySelectorAll('#taskModal .color-option');
    colorOptions.forEach(opt => {
        opt.classList.remove('selected');
        if (task.color && opt.dataset.color === task.color) {
            opt.classList.add('selected');
        } else if (!task.color && opt.dataset.color === 'none') {
            opt.classList.add('selected');
        }
    });

    closeTaskDetailsModal();
    document.getElementById('taskModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('taskTitleInput').focus(), 100);
}

/**
 * Exclui a tarefa a partir do modal de detalhes
 */
function deleteTaskFromDetails() {
    showConfirmDialog('Excluir Tarefa', 'Tem certeza que deseja excluir esta tarefa?', (confirmed) => {
        if (confirmed) {
            const userData = db.getCurrentUserData();
            const board = userData.boards.find(b => b.id === currentBoardId);
            if (!board) return;

            const list = board.lists.find(l => l.id === currentListId);
            if (list) {
                const taskName = list.tasks.find(t => t.id === currentTaskId)?.title;
                list.tasks = list.tasks.filter(t => t.id !== currentTaskId);
                db.saveCurrentUserData(userData);
                loadBoard();
                closeTaskDetailsModal();
                console.log(`[Tasks] Tarefa excluída: ${taskName}`);
            }
        }
    });
}

/**
 * Move uma tarefa para um quadro diferente
 */
function moveTaskToDifferentBoard(taskId, sourceListId, sourceBoardId, targetBoardId, targetListId) {
    const userData = db.getCurrentUserData();
    const sourceBoard = userData.boards.find(b => b.id === sourceBoardId);
    const targetBoard = userData.boards.find(b => b.id === targetBoardId);

    if (!sourceBoard || !targetBoard) return;

    const sourceList = sourceBoard.lists.find(l => l.id === sourceListId);
    const targetList = targetBoard.lists.find(l => l.id === targetListId);

    if (!sourceList || !targetList) return;

    const taskIndex = sourceList.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = sourceList.tasks.splice(taskIndex, 1);
    targetList.tasks.push(task);

    db.saveCurrentUserData(userData);
    loadBoard();
    closeTaskDetailsModal();

    showAlert('Sucesso', `Tarefa movida para "${targetBoard.name} → ${targetList.name}"`);
    console.log(`[Tasks] Tarefa movida entre quadros: ${task.title}`);
}

/**
 * Exibe menu de contexto para tarefa
 */
function showTaskContextMenu(event, listId, taskId) {
    event.preventDefault();
    event.stopPropagation();

    // Remove menu anterior se existir
    const oldMenu = document.querySelector('.context-menu');
    if (oldMenu) oldMenu.remove();

    const userData = db.getCurrentUserData();
    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    const menu = document.createElement('div');
    menu.className = 'context-menu show';
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';

    let menuHtml = '<div class="text-xs font-semibold text-gray-500 dark:text-gray-400 px-4 py-2">Mover para lista</div>';

    board.lists.forEach(l => {
        if (l.id !== listId) {
            menuHtml += `
                <div class="context-menu-item" onclick="moveTaskToList('${taskId}', '${listId}', '${l.id}', -1); closeContextMenu()">
                    <span>📋 ${escapeHtml(l.name)}</span>
                </div>
            `;
        }
    });

    menuHtml += '<div class="context-menu-separator"></div>';
    menuHtml += `
        <div class="context-menu-item" onclick="showTaskDetails('${listId}', '${taskId}'); closeContextMenu()">
            <span>👁️ Ver detalhes</span>
        </div>
        <div class="context-menu-item danger" onclick="deleteTaskQuick('${listId}', '${taskId}'); closeContextMenu()">
            <span>🗑️ Excluir</span>
        </div>
    `;

    menu.innerHTML = menuHtml;
    document.body.appendChild(menu);

    // Fechar ao clicar fora
    setTimeout(() => {
        document.addEventListener('click', closeContextMenu);
    }, 100);
}

/**
 * Fecha o menu de contexto
 */
function closeContextMenu() {
    const menu = document.querySelector('.context-menu');
    if (menu) menu.remove();
    document.removeEventListener('click', closeContextMenu);
}

/**
 * Exclui uma tarefa rapidamente (sem confirmação extra)
 */
function deleteTaskQuick(listId, taskId) {
    showConfirmDialog('Excluir Tarefa', 'Tem certeza que deseja excluir esta tarefa?', (confirmed) => {
        if (confirmed) {
            const userData = db.getCurrentUserData();
            const board = userData.boards.find(b => b.id === currentBoardId);
            if (!board) return;

            const list = board.lists.find(l => l.id === listId);
            if (list) {
                const taskName = list.tasks.find(t => t.id === taskId)?.title;
                list.tasks = list.tasks.filter(t => t.id !== taskId);
                db.saveCurrentUserData(userData);
                loadBoard();
                console.log(`[Tasks] Tarefa excluída: ${taskName}`);
            }
        }
    });
}
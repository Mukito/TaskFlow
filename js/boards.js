/**
 * Boards Module
 * Gerencia operações relacionadas a quadros
 */

let currentBoardId = null;
let editingBoardId = null;

/**
 * Renderiza as abas de quadros
 */
function renderBoardTabs() {
    const userData = db.getCurrentUserData();
    const tabsContainer = document.getElementById('boardTabs');
    tabsContainer.innerHTML = '';

    userData.boards.forEach(board => {
        const tab = document.createElement('button');
        tab.className = `board-tab px-4 py-2 rounded-lg font-medium text-base ${
            board.id === currentBoardId 
                ? 'active' 
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`;
        tab.textContent = board.name;
        tab.onclick = () => switchBoard(board.id);
        tabsContainer.appendChild(tab);
    });
}

/**
 * Troca para outro quadro
 * @param {string} boardId - ID do quadro
 */
function switchBoard(boardId) {
    currentBoardId = boardId;
    const userData = db.getCurrentUserData();
    userData.currentBoardId = boardId;
    db.saveCurrentUserData(userData);
    renderBoardTabs();
    loadBoard();
}

/**
 * Exibe modal para adicionar novo quadro
 */
function showAddBoardModal() {
    editingBoardId = null;
    document.getElementById('boardModalTitle').textContent = 'Novo Quadro';
    document.getElementById('boardNameInput').value = '';
    document.getElementById('deleteBoardBtn').classList.add('hidden');
    document.getElementById('boardModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('boardNameInput').focus(), 100);
}

/**
 * Exibe modal para editar quadro atual
 */
function showEditBoardModal() {
    const userData = db.getCurrentUserData();
    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    editingBoardId = currentBoardId;
    document.getElementById('boardModalTitle').textContent = 'Editar Quadro';
    document.getElementById('boardNameInput').value = board.name;
    document.getElementById('deleteBoardBtn').classList.remove('hidden');
    document.getElementById('boardModal').classList.remove('hidden');
    setTimeout(() => document.getElementById('boardNameInput').focus(), 100);
}

/**
 * Fecha o modal de quadro
 */
function closeBoardModal() {
    document.getElementById('boardModal').classList.add('hidden');
    editingBoardId = null;
}

/**
 * Salva um quadro (novo ou editado)
 */
function saveBoard() {
    const name = document.getElementById('boardNameInput').value.trim();

    if (!name) {
        showAlert('Atenção', 'Por favor, insira um nome para o quadro');
        return;
    }

    const userData = db.getCurrentUserData();

    if (editingBoardId) {
        // Editar quadro existente
        const board = userData.boards.find(b => b.id === editingBoardId);
        if (board) {
            board.name = name;
            console.log(`[Boards] Quadro editado: ${name}`);
        }
    } else {
        // Criar novo quadro
        const newBoard = {
            id: generateId(),
            name: name,
            lists: [],
            createdAt: new Date().toISOString()
        };
        userData.boards.push(newBoard);
        currentBoardId = newBoard.id;
        userData.currentBoardId = currentBoardId;
        console.log(`[Boards] Quadro criado: ${name}`);
    }

    db.saveCurrentUserData(userData);
    closeBoardModal();
    renderBoardTabs();
    loadBoard();
    document.getElementById('noBoardsState').classList.add('hidden');
}

/**
 * Exclui o quadro atual
 */
function deleteCurrentBoard() {
    showConfirmDialog('Excluir Quadro', 'Tem certeza que deseja excluir este quadro e todas as suas listas e tarefas?', (confirmed) => {
        if (confirmed) {
            const userData = db.getCurrentUserData();
            const boardName = userData.boards.find(b => b.id === currentBoardId)?.name;
            userData.boards = userData.boards.filter(b => b.id !== currentBoardId);

            if (userData.boards.length > 0) {
                currentBoardId = userData.boards[0].id;
                userData.currentBoardId = currentBoardId;
            } else {
                currentBoardId = null;
                userData.currentBoardId = null;
            }

            db.saveCurrentUserData(userData);
            closeBoardModal();
            initializeApp();
            console.log(`[Boards] Quadro excluído: ${boardName}`);
        }
    });
}

/**
 * Carrega o quadro atual
 */
function loadBoard() {
    const userData = db.getCurrentUserData();
    if (!userData || !currentBoardId) return;

    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    document.getElementById('currentBoardTitle').textContent = board.name;
    const listsContainer = document.getElementById('listsContainer');
    listsContainer.innerHTML = '';

    if (!board.lists || board.lists.length === 0) {
        document.getElementById('emptyState').classList.remove('hidden');
        return;
    }

    document.getElementById('emptyState').classList.add('hidden');

    board.lists.forEach(list => {
        renderList(list);
    });

    console.log(`[Boards] Quadro carregado: ${board.name} (${board.lists.length} listas)`);
}
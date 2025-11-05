
/**
 * Main Module
 * Inicialização da aplicação
 */

/**
 * Inicializa a aplicação após o login
 */
function initializeApp() {
    const userData = db.getCurrentUserData();

    if (!userData.boards || userData.boards.length === 0) {
        document.getElementById('noBoardsState').classList.remove('hidden');
        document.getElementById('emptyState').classList.add('hidden');
        document.getElementById('listsContainer').innerHTML = '';
        return;
    }

    document.getElementById('noBoardsState').classList.add('hidden');

    if (userData.currentBoardId && userData.boards.find(b => b.id === userData.currentBoardId)) {
        currentBoardId = userData.currentBoardId;
    } else {
        currentBoardId = userData.boards[0].id;
        userData.currentBoardId = currentBoardId;
        db.saveCurrentUserData(userData);
    }

    renderBoardTabs();
    loadBoard();

    console.log('[Main] Aplicação inicializada com sucesso');
}

/**
 * Inicialização quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('[Main] TaskFlow iniciando...');

    // Inicializa dark mode
    initializeDarkMode();

    // Inicializa color pickers
    initializeColorPickers();

    console.log('[Main] Sistema pronto!');
});
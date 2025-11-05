/**
 * Drag and Drop Module
 * Sistema completo de arrastar e soltar com reordenação
 */

let draggedElement = null;
let sourceListId = null;
let draggedTaskId = null;

/**
 * Inicia o arrasto de uma tarefa
 */
function handleDragStart(e) {
    draggedElement = e.target;
    draggedTaskId = e.target.dataset.taskId;
    sourceListId = e.target.closest('.list-container').dataset.listId;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.innerHTML);
    console.log(`[DragDrop] Iniciando arrasto da tarefa: ${draggedTaskId}`);
}

/**
 * Finaliza o arrasto de uma tarefa
 */
function handleDragEnd(e) {
    e.target.classList.remove('dragging');

    // Remove todas as classes de drag-over
    document.querySelectorAll('.drag-over').forEach(el => {
        el.classList.remove('drag-over');
    });

    console.log(`[DragDrop] Arrasto finalizado`);
}

/**
 * Lida com o arrasto sobre uma área de drop
 */
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';

    const tasksContainer = e.currentTarget;
    const afterElement = getDragAfterElement(tasksContainer, e.clientY);
    const draggable = draggedElement;

    if (afterElement == null) {
        tasksContainer.appendChild(draggable);
    } else {
        tasksContainer.insertBefore(draggable, afterElement);
    }

    tasksContainer.classList.add('drag-over');
    return false;
}

/**
 * Lida com a saída do arrasto de uma área
 */
function handleDragLeave(e) {
    // Só remove se estamos saindo do container, não entrando em um filho
    if (e.currentTarget.contains(e.relatedTarget)) {
        return;
    }
    e.currentTarget.classList.remove('drag-over');
}

/**
 * Lida com o drop (soltar) de uma tarefa
 */
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }

    e.currentTarget.classList.remove('drag-over');

    const targetListId = e.currentTarget.dataset.listId;
    const targetTaskElements = Array.from(e.currentTarget.querySelectorAll('[data-task-id]'));
    const newIndex = targetTaskElements.indexOf(draggedElement);

    if (newIndex === -1) {
        // Tarefa dropada no container mas não visível
        moveTaskToList(draggedTaskId, sourceListId, targetListId, -1);
    } else {
        moveTaskToList(draggedTaskId, sourceListId, targetListId, newIndex);
    }

    return false;
}

/**
 * Calcula o elemento após o qual devemos inserir a tarefa arrastada
 */
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('[draggable="true"]:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

/**
 * Move uma tarefa para outra lista com índice específico
 */
function moveTaskToList(taskId, fromListId, toListId, newIndex) {
    const userData = db.getCurrentUserData();
    const board = userData.boards.find(b => b.id === currentBoardId);
    if (!board) return;

    const fromList = board.lists.find(l => l.id === fromListId);
    const toList = board.lists.find(l => l.id === toListId);

    if (!fromList || !toList) return;

    const taskIndex = fromList.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;

    const [task] = fromList.tasks.splice(taskIndex, 1);

    // Se mover para a mesma lista e o novo índice é após a posição antiga,
    // precisamos ajustar o índice porque já removemos o item
    if (fromListId === toListId && newIndex > taskIndex) {
        newIndex--;
    }

    // Inserir na posição correta
    if (newIndex === -1 || newIndex >= toList.tasks.length) {
        toList.tasks.push(task);
    } else {
        toList.tasks.splice(newIndex, 0, task);
    }

    db.saveCurrentUserData(userData);
    loadBoard();

    console.log(`[DragDrop] Tarefa movida: ${task.title} (${fromList.name} → ${toList.name})`);
}
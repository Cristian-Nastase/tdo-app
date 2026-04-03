export const editTaskElement = function (id, title) {
    const element = document.querySelector(`task-node[data-id="${id}"`);
    element.setTitle(title);
}
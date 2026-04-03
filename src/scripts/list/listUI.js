const listContainer = document.querySelector(".list__container");

const listTitle = document.querySelector(".list__title");
const listDescription = document.querySelector(".list__description");

export const createListElement = function (taskData) {
    const task = document.createElement("task-node");
    task.dataset.id = taskData.id;
    listContainer.append(task);
}

export const editTaskElement = function (id, title) {
    const element = document.querySelector(`task-node[data-id="${id}"`);
    element.setTitle(title);
}

export const loadUI = function (title, description) {
    listTitle.innerText = title;
    listDescription.innerText = description || "no description.";
}

export const removeTaskElement = function (id) {
    listContainer.querySelector(`task-node[data-id="${id}"]`).remove();
}
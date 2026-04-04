import { reorderTasks } from "./listLogic.js";

export const listContainer = document.querySelector(".list__container");

const listTitle = document.querySelector(".list__title");
const listDescription = document.querySelector(".list__description");

export const createListElement = function (taskData) {
    const task = returnTaskElement(taskData.id);

    listContainer.append(task);
}

const returnTaskElement = function (id) {
    const task = document.createElement("task-node");
    task.dataset.id = id;

    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", dragStart);
    task.addEventListener("dragend", dragEnd);

    return task;
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


const dragStart = function (e) {
    listContainer.insertBefore(makePlaceholder(this), e.currentTarget);

    this.style.opacity = 0;
    const width = this.offsetWidth;

    this.style.position = "fixed";
    this.style.width = `${width}px`;

    this.setAttribute("id", "dragged-task");

    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("task", "");
}

const dragEnd = function (e) {
    this.style.opacity = 1;
    this.style.position = "relative";
    this.removeAttribute("id");

    const placeholders = listContainer.querySelectorAll(".placeholder");
    placeholders.forEach(element => {
        element.remove();
    });
}

const makePlaceholder = function (draggedTask) {
    const placeholder = document.createElement("div");
    placeholder.classList.add("placeholder");
    placeholder.style.height = `${draggedTask.offsetHeight}px`;
    return placeholder;
}

const dragOver = function (e) {
    if (e.dataTransfer.types.includes("task")) {
        e.preventDefault();

        const draggableTask = document.getElementById("dragged-task");

        if (e.target.tagName === "TASK-NODE" && draggableTask !== e.target) {
            const placeholders = listContainer.querySelectorAll(".placeholder");

            if (listContainer.lastElementChild == e.target) {
                listContainer.appendChild(makePlaceholder(draggableTask));
            }
            else {
                listContainer.insertBefore(makePlaceholder(draggableTask), e.target);
            }
            
            placeholders.forEach(element => {
                element.remove();
            });
        }
    }
}

const drop = function (e) {
    e.preventDefault();

    const draggedTask = document.getElementById("dragged-task");
    const placeholder = listContainer.querySelector(".placeholder");

    if (!placeholder) return;

    listContainer.insertBefore(draggedTask, placeholder);
    placeholder.remove();

    reorderTasks();
}

listContainer.addEventListener("dragover", dragOver);
listContainer.addEventListener("drop", drop);
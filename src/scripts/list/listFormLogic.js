import { newTask, editTask, returnTaskData } from "./listLogic.js";
import { editTaskElement } from "./listUI.js";

export const startDialog = function (id = null) {
    if (!id) {
        dialog.showModal();
        return;
    }

    const data = returnTaskData(id);

    if (!data)
        return;

    const title = data.title;

    const titleElement = document.getElementById("form-title-edit");
    titleElement.value = title;

    editDialog.dataset.id = id;
    editDialog.showModal();
};

const dialogSubmit = function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    newTask(data);
    dialog.close();
    form.reset();
};

const submitEdit = function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const id = editDialog.dataset.id;

    editTask(id, data.title.trim());
    editTaskElement(id, data.title.trim());

    editDialog.close();
    editForm.reset();
}

const dialog = document.getElementById("task-dialog");
const form = document.getElementById("task-form");
const addTaskButton = document.querySelector(".list__create");
const closeButton = document.querySelector(".dialog__close");

addTaskButton.addEventListener("click", startDialog);
closeButton.addEventListener("click", () => dialog.close());
form.addEventListener("submit", dialogSubmit);

const editDialog = document.getElementById("dialog-edit");
const editForm = document.getElementById("form-edit");
const closeEditButton = document.querySelector(".dialog__close--edit");

editDialog.addEventListener("submit", submitEdit);
closeEditButton.addEventListener("click", () => { editDialog.close() });
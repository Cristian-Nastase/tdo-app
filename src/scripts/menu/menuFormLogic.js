import { createList, editList, returnListData } from "./menuLogic.js";
import { editListElement } from "./menuUI.js";

const dialog = document.getElementById("dialog");
const form = dialog.querySelector(".form");
const closeDialogButton = dialog.querySelector(".dialog__close");

const editDialog = document.getElementById("dialog-edit");
const editForm = editDialog.querySelector(".form");
const closeEditButton = editDialog.querySelector(".dialog__close");


export const startDialog = function (e, id = null) {
    if(!id) {
        dialog.showModal();
        return;
    }

    const { title, description } = returnListData(parseInt(id));

    const titleElement = document.getElementById("form-title-edit");
    titleElement.value = title; 

    const descriptionElement = document.getElementById("form-description-edit");
    descriptionElement.value = description;

    editDialog.dataset.id = id;
    editDialog.showModal();
}

const closeDialog = function () {
    dialog.close();
}

const closeEditDialog = function () {
    editDialog.close();
}

const submitDialog = function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    createList(data.title.trim(), data.description.trim());

    closeDialog();
    form.reset();
}

const submitEdit = function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const id = editDialog.dataset.id; 

    editList(id, data.title.trim(), data.description.trim());
    editListElement(id, data.title.trim());

    closeEditDialog();
    editForm.reset();
}

closeDialogButton.addEventListener("click", closeDialog);
closeEditButton.addEventListener("click", closeEditDialog);

dialog.addEventListener("submit", submitDialog);
editDialog.addEventListener("submit", submitEdit);
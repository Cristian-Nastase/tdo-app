import { createList } from "./menuLogic.js";

const dialog = document.querySelector(".dialog");
const form = document.querySelector(".form");
const closeDialogButton = document.querySelector(".dialog__close");

export const startDialog = function () {
    dialog.showModal();
}

const closeDialog = function () {
    dialog.close();
}

const submitDialog = function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    createList(data.title.trim(), data.description.trim());
    closeDialog();

    form.reset();
}

closeDialogButton.addEventListener("click", closeDialog);
dialog.addEventListener("submit", submitDialog);

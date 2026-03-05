import { newTask } from './listLogic.js';

const dialog = document.getElementById("task-dialog");
const form = document.getElementById("task-form");

export const startDialog = function() {
    dialog.showModal();
    
    const closeButton = document.querySelector(".dialog__close");
    closeButton.addEventListener("click", () => 
    { 
            dialog.close();
    });
}

export const dialogSubmit = function(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    newTask(data);
    dialog.close();
    form.reset();
}
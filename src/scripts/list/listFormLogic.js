import { newTask } from "./listLogic.js";

const startDialog = function () {
    dialog.showModal();
};

const dialog = document.getElementById("task-dialog");

const addTaskButton = document.querySelector(".list__create");
addTaskButton.addEventListener("click", startDialog);

const closeButton = document.querySelector(".dialog__close");
closeButton.addEventListener("click", () => dialog.close());

const dialogSubmit = function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    newTask(data);
    dialog.close();
    form.reset();
};

const form = document.getElementById("task-form");
form.addEventListener("submit", dialogSubmit);

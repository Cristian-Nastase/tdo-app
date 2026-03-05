import { startDialog, dialogSubmit } from "./listFormLogic.js";

export const newTask = function(data) {
    const taskData = { 
        checked: false,
        ...data,
        subtasks: []
    };

    listData.push(taskData);

    const task = document.createElement("task-node");
    task.dataset.index = listData.length - 1;
    listContainer.append(task);
};

export const getTaskContent = function (index) {
    return listData[index];
}

const listData = [];

const listContainer = document.querySelector(".list__container");

const form = document.getElementById("task-form")
const addTaskButton = document.querySelector(".list__create");

addTaskButton.addEventListener("click", startDialog);
form.addEventListener("submit", dialogSubmit);

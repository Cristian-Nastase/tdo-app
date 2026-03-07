export const newTask = function (data) {
    const taskData = {
        id: currentID,
        checked: false,
        ...data,
        subtasks: []
    };

    listMap.set(currentID, taskData);

    const task = document.createElement("task-node");
    task.dataset.id = currentID;
    listContainer.append(task);

    currentID++;

    if (state.loading) return;

    populateLocalStorage();
}

const loadList = function () {
    const listDataJSON = window.localStorage.getItem("list-data") ?? undefined;

    if (!listDataJSON) {
        state.loading = false;
        return;
    }

    const parseJSON = JSON.parse(listDataJSON);

    if (!parseJSON.length) {
        state.loading = false;
        return;
    }

    for (const taskData of parseJSON) {
        newTask(taskData);
    }

    state.loading = false;
}

window.addEventListener("load", loadList);

export const populateLocalStorage = function () {
    const listArr = [];

    for (const [key, value] of listMap) {
        const obj = { id: key, ...value };
        listArr.push(obj);
    }

    const listDataJSON = JSON.stringify(listArr);
    window.localStorage.setItem("list-data", listDataJSON);
}

export const setChecked = function (id, value) {
    listMap.get(id).checked = value;
    populateLocalStorage();
}

export const getTaskContent = function (id, object) {
    const content = listMap.get(id);
    object.setContent(content);
}

const state = { loading: true };
const listMap = new Map();
let currentID = 1;

const listContainer = document.querySelector(".list__container");
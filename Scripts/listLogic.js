import { state, setStorageState } from './state.js';

const returnCurrentIndex = function () {
    return parseInt(state.currentList);
}

const returnListsData = function () {
    const lists = localStorage.getItem("lists-data");

    if (!lists)
        throw new Error("LocalStorage does not have past data set");

    const data = JSON.parse(lists);

    if (!data)
        throw new Error("LocalStorage does not contain any data");

    return data;
}

const returnCurrentListData = function () {
    let data;

    try {
        data = returnListsData();
    }
    catch {
        throw new Error("Current list does not exist, abort immediately");
    }

    const currentListData = data[returnCurrentIndex()];

    if (!currentListData)
        throw new Error(`Current list index (${returnCurrentIndex}) does not exist`);

    return currentListData;
}

const createID = function () {
    return Math.ceil(Math.random() * maxTasks);
};

export const newTask = function (data) {
    const taskData = {};

    if (!state.loading) {
        let id = createID();

        while (listMap.has(id)) {
            id = createID();
        }

        const obj = {
            id,
            checked: false,
            ...data,
            subtasks: []
        };

        Object.assign(taskData, obj);
    }
    else {
        Object.assign(taskData, data);
    }

    listMap.set(taskData.id, taskData);

    const task = document.createElement("task-node");
    task.dataset.id = taskData.id;
    listContainer.append(task);

    if (state.loading)
        return;

    populateLocalStorage();
}

const listTitle = document.querySelector(".list__title");
const listDescription = document.querySelector(".list__description");

const loadList = function () {
    state.inMenu = false;
    setStorageState();

    let listData;

    try {
        listData = returnCurrentListData();
    }
    catch (error) {
        console.error(error);
        location.assign("http://127.0.0.1:5500/menu.html")
    }

    listTitle.innerText = listData.title;
    listDescription.innerText = listData.description;

    for (const taskData of listData.tasks) {
        newTask(taskData);
    }

    state.loading = false;
}

window.addEventListener("load", loadList);

const populateLocalStorage = function () {
    const currentListData = returnCurrentListData();
    const taskArr = [];

    for (const [key, value] of listMap) {
        const obj = { id: key, ...value };
        taskArr.push(obj);
    }

    currentListData.tasks = taskArr;

    const listsLocalData = returnListsData();
    listsLocalData[returnCurrentIndex()] = currentListData;

    const listsJSON = JSON.stringify(listsLocalData);
    localStorage.setItem("lists-data", listsJSON);
}

export const setChecked = function (id, value) {
    if (state.loading)
        return;

    listMap.get(id).checked = value;
    populateLocalStorage();
}

export const getTaskContent = function (id, object) {
    if (!listMap.has(id))
        throw new Error("No task with this ID");

    const content = listMap.get(id);
    object.setContent(content);
}

export const removeTask = function (id) {
    listMap.delete(id);
    populateLocalStorage();

    listContainer.querySelector(`task-node[data-id="${id}"]`).remove();
}

const listMap = new Map();
const maxTasks = 400;

const listContainer = document.querySelector(".list__container");
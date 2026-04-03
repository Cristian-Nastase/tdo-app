import { state, setStorageState } from '../state.js';
import { loadUI, createListElement, removeTaskElement } from './listUI.js';

const listMap = new Map();
const maxTasks = 400;

const returnCurrentId = function () {
    return parseInt(state.currentList);
}

const returnListData = function () {
    const data = localStorage.getItem(`list-${returnCurrentId()}`);

    if (!data)
        throw new Error("LocalStorage does not have past data set");

    const list = JSON.parse(data);

    if (!list)
        throw new Error("LocalStorage does not contain any data");

    return list;
}

export const returnTaskData = function (_id) {
    const id = Number(_id);

    if (!listMap.has(id)) {
        return null;
    }

    return listMap.get(id);
}

const createID = function () {
    if (listMap.size === maxTasks) {
        throw new Error("No more tasks available");
    }

    for (let i = 0; i < maxTasks; i++) {
        if (!listMap.has(i))
            return i;
    }
};

export const newTask = function (data) {
    const taskData = {};

    if (!state.loading) {
        let id;
        try {
            id = createID();
        }
        catch(error) {
            console.warn("Task limit reached. Delete tasks or create a  new list.");
            return;
        }
        const obj = {
            id,
            checked: false,
            ...data,
        };

        Object.assign(taskData, obj);
    }
    else {
        Object.assign(taskData, data);
    }

    listMap.set(taskData.id, taskData);
    createListElement(taskData);

    if (state.loading)
        return;

    populateLocalStorage();
}

export const editTask = function (_id, title) {
    const id = Number(_id);

    const task = listMap.get(id);
    task.title = title;

    populateLocalStorage();
}

const loadList = function () {
    state.inMenu = false;
    setStorageState();

    let listData;

    try {
        listData = returnListData();
    }
    catch (error) {
        console.error(error);
        location.assign("index.html");
        return;
    }

    loadUI(listData.title, listData.description);

    for (const taskData of listData.tasks) {
        newTask(taskData);
    }

    state.loading = false;
}

window.addEventListener("load", loadList);

const populateLocalStorage = function () {
    const currentListData = returnListData();
    const taskArr = [];

    for (const [key, value] of listMap) {
        const obj = { id: key, ...value };
        taskArr.push(obj);
    }

    currentListData.tasks = taskArr;

    const listJSON = JSON.stringify(currentListData);
    localStorage.setItem(`list-${returnCurrentId()}`, listJSON);
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

    removeTaskElement(id);
}
const createID = function() {
    return Math.ceil(Math.random() * maxTasks);
};

export const newTask = function (data) {
    let id = createID();
    
    while(id in listMap.keys()) {
        id = createID();
    }

    const taskData = {
        id,
        checked: false,
        ...data,
        subtasks: []
    };

    listMap.set(id, taskData);

    const task = document.createElement("task-node");
    task.dataset.id = id;
    listContainer.append(task);

    populateLocalStorage();
}

const loadTask = function(taskData) {
    listMap.set(taskData.id, taskData);
    const task = document.createElement("task-node");
    task.dataset.id = taskData.id;
    listContainer.append(task);
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
        loadTask(taskData);
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
    if(state.loading) return;
    
    listMap.get(id).checked = value;
    populateLocalStorage();
}

export const getTaskContent = function (id, object) {
    const content = listMap.get(id);
    object.setContent(content);
}

const state = { loading: true };
const listMap = new Map();
const maxTasks = 400;

const listContainer = document.querySelector(".list__container");
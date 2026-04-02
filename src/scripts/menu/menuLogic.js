import { state, setStorageState } from "../state.js";
import { createListElement, loadUI } from "./menuUI.js";

const lists = new Map();
const maxLists = 20;
const usedIds = new Set();

export const returnListData = function(id) {
    const list = lists.get(id);

    const title = list?.title ?? "";
    const description = list?.description ?? "";

    return { title, description };
}

const generateListId = function() {
    if(lists.size === maxLists)
        throw new Error("No more tasks available, reached the limit.");

    let id = Math.floor(Math.random() * maxLists);
    
    while(usedIds.has(id)) {
        id = Math.floor(Math.random() * maxLists);
    }

    usedIds.add(id);
    return id;
};

const extractIds = function() {
    const data = JSON.parse(localStorage.getItem("used-ids"));

    if(!data)
        return [];
    
    return data;
}

const saveIds = function() {
    if(!usedIds)
        return;

    const arr = Array.from(usedIds.values());

    const data = JSON.stringify(arr);
    localStorage.setItem("used-ids", data);
}

const extractLocalStorage = function (id) {
    const data = JSON.parse(localStorage.getItem(`list-${id}`));

    if (!data)
        return;

    createList(data.title, data.description, id);
}

const saveLocalStorage = function (id) {
    if(!lists.size)
        return;

    const data = JSON.stringify(lists.get(id));
    localStorage.setItem(`list-${id}`, data);
}


export const createList = function (title, description, listId = null) {
    if (lists.size === maxLists) {
        console.log("No more lists available");
        return;
    }

    const id = listId ?? generateListId();

    const list = {
        id,
        title,
        description,
        tasks: []
    };

    lists.set(id, list);

    createListElement(title, id);

    if(!state.loading) {
        saveLocalStorage(id);
        saveIds();
    }
}

export const editList = function(id, title, description) {
    const intId = parseInt(id);

    const list = lists.get(intId);

    list.title = title;
    list.description = description;

    saveLocalStorage(intId);
}

export const removeList = function(e) {
    const element = e.currentTarget;

    const id = parseInt(element.dataset.index);

    element.toggleAttribute("delete");

    lists.delete(id);
    usedIds.delete(id);

    localStorage.removeItem(`list-${id}`);
    saveIds();
    
    setTimeout(() => {
        element.remove();
    } , 200);
}

export const enterList = function (e) {
    state.currentList = e.currentTarget.dataset.index;
    setStorageState();
    location.assign("list.html");
}

const loadMenu = function () {
    state.inMenu = true;
    state.loading = true;
    state.currentList = null;
    setStorageState();

    loadUI();

    try {
        const ids = extractIds();
        ids.forEach(usedIds.add, usedIds);

        for(const id of ids) {
            extractLocalStorage(id);
        }
    }
    catch(error) {
        console.error(error);
        console.warn("No data found, will load an empty menu.");
    }
    
    state.loading = false;
    setStorageState();
}

window.addEventListener("load", loadMenu);
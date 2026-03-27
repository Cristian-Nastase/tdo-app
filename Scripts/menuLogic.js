import { state, setStorageState } from "./state.js";
import { startDialog } from "./menuFormLogic.js"

const lists = new Map();
const maxLists = 20;
const usedIds = [];

const generateListId = function() {
    if(lists.size === maxLists)
        throw new Error("No more tasks available, reached the limit.");

    let id = Math.floor(Math.random() * maxLists);
    
    while(usedIds.includes(id)) {
        id = Math.floor(Math.random() * maxLists);
    }

    usedIds.push(id);
    return id;
};

const extractIds = function() {
    const data = JSON.parse(localStorage.getItem("used-ids"));

    if(!data)
        throw new Error(`Cannot read used ids from localStorage.`);
    
    return data;
}

const saveIds = function() {
    if(!usedIds)
        return;

    const data = JSON.stringify(usedIds);
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

const listsContainer = document.querySelector(".lists__container");

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

    const listElement = document.createElement("div");
    listElement.classList.add("list");
    listElement.dataset.index = id;

    const paragraph = document.createElement("p");
    paragraph.innerText = title;

    listElement.appendChild(paragraph);
    listsContainer.appendChild(listElement);

    listElement.addEventListener("click", enterList);

    if(!state.loading) {
        saveLocalStorage(id);
        saveIds();
    }
}

const enterList = function (e) {
    state.currentList = e.currentTarget.dataset.index;
    setStorageState();
    location.assign("list.html");
}

const loadMenu = function () {
    state.inMenu = true;
    state.loading = true;
    state.currentList = null;
    setStorageState();

    const createButton = document.querySelector(".banner__button");
    createButton.addEventListener("click", startDialog);

    try {
        const ids = extractIds();
        usedIds.push(...ids);

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
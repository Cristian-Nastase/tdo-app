import { state, setStorageState } from "./state.js";
import { startDialog } from "./menuFormLogic.js"

const lists = new Map();
const maxLists = 20;
const usedIds = new Set();

const hammerButton = document.querySelector(".hammer");
const listsSection = document.querySelector(".lists");

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
        throw new Error(`Cannot read used ids from localStorage.`);
    
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

    const listElement = document.createElement("button");
    listElement.type = "button";
    listElement.classList.add("list");
    listElement.dataset.index = id;

    const paragraph = document.createElement("p");
    paragraph.innerText = title;

    listElement.appendChild(paragraph);
    listsContainer.prepend(listElement);

    listElement.addEventListener("click", enterList);

    if(!state.loading) {
        saveLocalStorage(id);
        saveIds();
    }
}

const removeList = function(e) {
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

const enterList = function (e) {
    if(hammerButton.hasAttribute("active")) {
        removeList(e);
        return;
    }

    state.currentList = e.currentTarget.dataset.index;
    setStorageState();
    location.assign("Pages/list.html");
}

const toggleHammer = function() {
    hammerButton.toggleAttribute("active");
    listsSection.toggleAttribute("hammer");

    const ariaPressed = hammerButton.hasAttribute("active") ? "true" : "false"; 
    hammerButton.setAttribute("aria-pressed", ariaPressed);
}

const loadMenu = function () {
    state.inMenu = true;
    state.loading = true;
    state.currentList = null;
    setStorageState();

    const createButtonBanner = document.querySelector(".banner__button");
    createButtonBanner.addEventListener("click", startDialog);

    const createButtonContainer = document.querySelector(".list--create");
    createButtonContainer.addEventListener("click", startDialog);
    
    hammerButton.addEventListener("click", toggleHammer);
    hammerButton.removeAttribute("active");
    listsContainer.removeAttribute("hammer");

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
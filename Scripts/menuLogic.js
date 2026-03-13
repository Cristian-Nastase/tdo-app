import { state, setStorageState } from "./state.js";
import { startDialog } from "./menuFormLogic.js"

const lists = [];
const maxLists = 20;

const extractLocalStorage = function () {
    const data = JSON.parse(localStorage.getItem("lists-data"));

    if (!data)
        throw new Error(`No data saved`);

    for (const list of data) {
        createList(list.title, list.description);
    }

    state.loading = false;
}

const saveLocalStorage = function () {
    if(!lists)
        return;

    const data = JSON.stringify(lists);
    localStorage.setItem("lists-data", data);
}

const listsContainer = document.querySelector(".lists__container");

export const createList = function (title, description) {
    if (lists.length === maxLists) {
        console.log("No more lists available");
        return;
    }

    const list = {
        title,
        description,
        tasks: []
    };

    lists.push(list);

    if (!state.loading) {
        saveLocalStorage();
    }

    const listElement = document.createElement("div");
    listElement.classList.add("list");
    listElement.dataset.index = lists.length - 1;

    const paragraph = document.createElement("p");
    paragraph.innerText = title;

    listElement.appendChild(paragraph);
    listsContainer.appendChild(listElement);

    listElement.addEventListener("click", enterList);
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
        extractLocalStorage();
    }
    catch(error) {
        console.warn("No data found, will load an empty menu.");
        state.loading = false;
        setStorageState();
    }
}

window.addEventListener("load", loadMenu);
import { state, setStorageState } from "./state.js";

const lists = [];
const maxLists = 20;

const extractLocalStorage = function () {
    const data = JSON.parse(localStorage.getItem("lists-data"));

    if (!data)
        return;

    lists.push.apply(data);
}

const saveLocalStorage = function () {
    const data = JSON.stringify(lists);
    localStorage.setItem("lists-data", data);
}

const listsContainer = document.querySelector(".lists__container");

const createList = function (title, description) {
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
    saveLocalStorage();

    const paragraph = document.createElement("p");
    paragraph.innerText = title;
    listsContainer.appendChild(paragraph);
}

const loadMenu = function () {
    state.inMenu = true;
    setStorageState();

    const createButton = document.querySelector(".banner__button");
    createButton.addEventListener("click", () => createList("salut", "muie"));

    extractLocalStorage();
}

window.addEventListener("load", loadMenu);
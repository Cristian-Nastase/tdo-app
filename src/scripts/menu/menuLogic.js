import { state, setStorageState } from "../state.js";
import { createListElement, loadUI } from "./menuUI.js";

const lists = new Map();
const maxLists = 20;
const usedIds = new Set();

export const returnListData = function (id) {
    const list = lists.get(id);

    const title = list?.title ?? "";
    const description = list?.description ?? "";

    return { title, description };
};

const generateListId = function () {
    if (lists.size === maxLists) throw new Error("No more tasks available, reached the limit.");

    let id = Math.floor(Math.random() * maxLists);

    while (usedIds.has(id)) {
        id = Math.floor(Math.random() * maxLists);
    }

    usedIds.add(id);
    return id;
};

const extractIds = function () {
    const data = JSON.parse(localStorage.getItem("used-ids"));

    if (!data) return [];

    const ids = data.filter((n) => {
        return localStorage.getItem(`list-${n}`);
    });

    const diff = ids.length != data.length;

    return { ids, diff };
};

const saveIds = function () {
    if (!usedIds) return;

    const arr = Array.from(usedIds.values());

    const data = JSON.stringify(arr);
    localStorage.setItem("used-ids", data);
};

const extractLocalStorage = function (id) {
    const data = JSON.parse(localStorage.getItem(`list-${id}`));

    if (!data) return;

    data.lastModified = Date.parse(data.lastModified);

    return data;
};

const saveLocalStorage = function (id) {
    if (!lists.size) return;

    const list = lists.get(id);
    const data = { ...list, lastModified: list.lastModified.toJSON() };
    const jsonData = JSON.stringify(data);
    localStorage.setItem(`list-${id}`, jsonData);
};

export const createList = function (title, description, date = null, listId = null) {
    if (lists.size === maxLists) {
        console.log("No more lists available");
        return;
    }

    const id = listId ?? generateListId();

    const list = {
        id,
        title,
        description,
        lastModified: date ?? new Date(),
        tasks: [],
    };

    lists.set(id, list);

    createListElement(title, id);

    if (!state.loading) {
        saveLocalStorage(id);
        saveIds();
    }
};

export const editList = function (id, title, description) {
    const intId = parseInt(id);

    const list = lists.get(intId);

    list.title = title;
    list.description = description;
    list.lastModified = new Date(Date.now());

    saveLocalStorage(intId);
};

export const removeList = function (e) {
    const element = e.currentTarget;

    const id = parseInt(element.dataset.index);

    element.toggleAttribute("delete");

    lists.delete(id);
    usedIds.delete(id);

    localStorage.removeItem(`list-${id}`);
    saveIds();

    setTimeout(() => {
        element.remove();
    }, 200);
};

export const enterList = function (e) {
    state.currentList = e.currentTarget.dataset.index;
    setStorageState();
    location.assign("list.html");
};

const loadMenu = function () {
    state.inMenu = true;
    state.loading = true;
    state.currentList = null;
    setStorageState();

    loadUI();

    try {
        const { ids, diff } = extractIds();
        ids.forEach(usedIds.add, usedIds);

        if(diff) saveIds();

        const data = [];
        for (const id of ids) {
            data.push(extractLocalStorage(id));
        }

        data.filter(Boolean).sort((a, b) => a.lastModified - b.lastModified);

        for (const list of data) {
            createList(list.title, list.description, new Date(list.lastModified), list.id);
        }
    } catch (error) {
        console.error(error);
        console.warn("No data found, will load an empty menu.");
    }

    state.loading = false;
    setStorageState();
};

window.addEventListener("load", loadMenu);

import { enterList, removeList } from './menuLogic.js';
import { startDialog } from "./menuFormLogic.js";

const listsSection = document.querySelector(".lists");

const options = document.querySelectorAll(".option");

const listsContainer = document.querySelector(".lists__container");

export const createListElement = function (title, id) {
    const listElement = document.createElement("button");

    listElement.type = "button";
    listElement.classList.add("list");
    listElement.dataset.index = id;

    const span = document.createElement("span");
    span.innerText = title;

    listElement.appendChild(span);
    listsContainer.prepend(listElement);

    listElement.addEventListener("click", checkOption);
}

export const editListElement = function (id, title) {
    listsContainer
        .querySelector(`[data-index="${id}"]`)
            .querySelector("span")
                .innerText = title;
}

const checkOption = function(e) {
    let string = null;
    
    for(const option of options) {
        if(option.hasAttribute("active")) {
            string = option.classList[1];
            break;
        }
    }

    switch(string) {
        case "hammer":
            removeList(e);
            break;
        case "edit":
            startDialog(null, e.currentTarget.dataset.index);
            break;
        default:
            enterList(e);
    }
}


export const loadUI = function () {
    const createButtonBanner = document.querySelector(".banner__button");
    createButtonBanner.addEventListener("click", startDialog);

    const createButtonContainer = document.querySelector(".list--create");
    createButtonContainer.addEventListener("click", startDialog);

    for (const option of options) {
        const optionString = option.classList[1];

        option.addEventListener("click", (e) => { 
            toggleOption(e.currentTarget, optionString); 
        });
        
        option.removeAttribute("active");
        listsContainer.removeAttribute(optionString);
    }

    listsContainer.removeAttribute("hammer");
}

const toggleOption = function (element, option) {
    element.toggleAttribute("active");
    listsSection.toggleAttribute(option);

    const ariaPressed = element.hasAttribute("active") ? "true" : "false";
    element.setAttribute("aria-pressed", ariaPressed);

    if (element.hasAttribute("active")) {
        untoggleOtherOptions(element);
    }
}

const untoggleOtherOptions = function(element) {
    for(const option of options) {
        if (option == element) {
            continue;
        }

        if (option.hasAttribute("active")) {
            toggleOption(option, option.classList[1]);
        }
    }
}
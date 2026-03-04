import { getTaskContent } from "../listLogic.js";

class Task extends HTMLElement {
    content;

    static observedAttributes = ["data-index", "checked"];

    constructor(data) {
        super();
    }

    connectedCallback() {
        this.renderData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        console.log("ATTRIBUTE CHANGED");
        if (name === "data-index" && oldValue === null) {
            this.content = getTaskContent(newValue);
        }
        
        if (name === "checked") this.toggleCheckState(newValue);
    }

    toggleCheckState(value) {
        console.log(value);
    }


    renderData() {
        const { title, description, color, subTasks } = this.content;

        const header = document.createElement("h2");
        header.innerText = title;
        header.classList.add("task__header");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.classList.add("task__input");
        checkbox.ariaLabel = "Check task";

        checkbox.addEventListener("change", () => this.toggleCheckState());

        this.append(checkbox, header);
    }
}

customElements.define("task-node", Task);
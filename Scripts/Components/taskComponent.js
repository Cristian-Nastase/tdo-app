import { getTaskContent } from "../listLogic.js";

class Task extends HTMLElement {
    content;

    static observedAttributes = ["data-index", "checked"];

    constructor(data) {
        super();

    }
    
    connectedCallback() {
        const taskTemplate = document.getElementById("task");
        const taskContent = taskTemplate.content;
        this.attachShadow({mode: 'open'}).appendChild(taskContent.cloneNode(true));

        this.renderData();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === "data-index" && oldValue === null) {
            this.content = getTaskContent(newValue);
        }

        if (name === "checked") this.content.checked = this.hasAttribute("checked");
    }

    renderData() {
        const title = this.content.title;

        const span = document.createElement("span");
        span.slot = "title";
        span.innerText = title;

        this.append(span);

        const checkbox = this.shadowRoot.querySelector(".task__input");
        checkbox.addEventListener("change", () => this.toggleChecked());

        if(this.content.checked) { 
            checkbox.checked = true;
            this.toggleChecked();
        }
    }

    toggleChecked() {
        this.toggleAttribute("checked");

        const input = this.shadowRoot.querySelector(".task__input");

        if (this.hasAttribute("checked")) input.ariaLabel = "Uncheck task";
        else input.ariaLabel = "Check task";
    }

}

customElements.define("task-node", Task);

import { getTaskContent, setChecked, removeTask } from "../list/listLogic.js";
import { startDialog } from '../list/listFormLogic.js';

class Task extends HTMLElement {
    content;
    rendered;
    menuActive;

    constructor() {
        super();
        this.rendered = false;
        this.menuActive = false;
    }

    connectedCallback() {
        if (this.shadowRoot)
            return;

        const taskTemplate = document.getElementById("task");

        this.attachShadow({ mode: 'open' }).appendChild(taskTemplate.content.cloneNode(true));

        try {
            getTaskContent(parseInt(this.dataset.id), this);
        }
        catch (error) {
            console.error(error);
            this.remove();
        }
    }

    setContent(data) {
        this.content = data;

        if (!this.rendered) {
            this.renderData();
            return;
        }

        this.updateData();
    }

    setTitle(title) {
        this.content.title = title;

        this.updateData();
    }

    renderData() {
        const title = this.content.title;

        const span = document.createElement("span");
        span.slot = "title";
        span.innerText = title;

        this.append(span);

        const checkbox = this.shadowRoot.querySelector(".task__input");
        checkbox.addEventListener("change", () => this.toggleChecked());

        if (this.content.checked) {
            checkbox.checked = true;
            this.toggleChecked();
        }

        const settingsButton = this.shadowRoot.querySelector(".task__settings");
        settingsButton.addEventListener("click", (e) => this.toggleSettings(e));

        const deleteTask = this.shadowRoot.querySelector(".task__button--remove");
        const id = this.content.id;
        deleteTask.addEventListener("click", () => removeTask(id));

        const editTask = this.shadowRoot.querySelector(".task__button--edit");
        editTask.addEventListener("click", () => startDialog(null, id));

        this.rendered = true;
    }

    updateData() {
        const slot = this.querySelector(`span[slot="title"]`);
        slot.innerText = this.content.title;
    }

    toggleChecked() {
        this.toggleAttribute("checked");
        this.content.checked = this.hasAttribute("checked");

        const input = this.shadowRoot.querySelector(".task__input");

        if (this.hasAttribute("checked")) input.ariaLabel = "Uncheck task";
        else input.ariaLabel = "Check task";

        setChecked(this.content.id, this.content.checked);
    }

    toggleSettings() {
        const menu = this.shadowRoot.querySelector(".task__menu");

        menu.classList.toggle("hidden");
        menu.setAttribute("aria-expanded", menu.getAttribute("aria-expanded") === "true" ? "false" : "true");
        
        this.menuActive = !menu.classList.contains("hidden");
    }
}
customElements.define("task-node", Task);

import { getTaskContent, setChecked, removeTask } from "../listLogic.js";
class Task extends HTMLElement {
    content;

    connectedCallback() {
        const taskTemplate = document.getElementById("task");
        this.attachShadow({ mode: 'open' }).appendChild(taskTemplate.content.cloneNode(true));

        getTaskContent(parseInt(this.dataset.id), this);
    }

    setContent(data) {
        this.content = data;

        this.renderData();
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

        this.addEventListener("contextmenu", (e) => this.toggleSettings(e));

        const settingsButton = this.shadowRoot.querySelector(".task__settings");
        settingsButton.addEventListener("click", (e) => this.toggleSettings(e));

        const deleteTask = this.shadowRoot.querySelector(".task__button--remove");
        const id = this.content.id;
        deleteTask.addEventListener("click", () => removeTask(id));
    }

    toggleChecked() {
        this.toggleAttribute("checked");
        this.content.checked = this.hasAttribute("checked");

        const input = this.shadowRoot.querySelector(".task__input");

        if (this.hasAttribute("checked")) input.ariaLabel = "Uncheck task";
        else input.ariaLabel = "Check task";

        setChecked(this.content.id, this.content.checked);
    }

    toggleSettings(e) {
        e.preventDefault();
        const menu = this.shadowRoot.querySelector(".task__menu");
        menu.classList.toggle("hidden");
        menu.setAttribute("aria-expanded", menu.getAttribute("aria-expanded") === "true" ? "false" : "true");
    }
}
customElements.define("task-node", Task);

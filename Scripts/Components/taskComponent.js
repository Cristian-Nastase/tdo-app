import { getTaskContent, setChecked } from "../listLogic.js";

class Task extends HTMLElement {
    content;

    connectedCallback() {
        const taskTemplate = document.getElementById("task");
        const taskContent = taskTemplate.content;
        this.attachShadow({ mode: 'open' }).appendChild(taskContent.cloneNode(true));

        getTaskContent(parseInt(this.dataset.id), this);
    }

    setContent(data) {
        this.content = data;
        console.log(this.content.id);

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
    }

    toggleChecked() {
        this.toggleAttribute("checked");
        this.content.checked = this.hasAttribute("checked");

        const input = this.shadowRoot.querySelector(".task__input");

        if (this.hasAttribute("checked")) input.ariaLabel = "Uncheck task";
        else input.ariaLabel = "Check task";

        setChecked(this.content.id, this.content.checked);
    }
}

customElements.define("task-node", Task);

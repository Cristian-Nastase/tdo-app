export const getTaskContent = function (index) {
    return listData[index];
}

const listData = [];

const list = document.querySelector(".list__container");
const spawnButton = document.querySelector(".spawn");

spawnButton.addEventListener("click", function () {
    const data = {
        title: `Task-ul ${listData.length + 1}`,
        description: "Descriere" ?? "",
        color: "black",
        checked: "true",
        subtasks: []
    };

    listData.push(data);

    const task = document.createElement("task-node");
    task.dataset.index = listData.length - 1;
    list.append(task);
});

export const newTask = function(data) {
    const taskData = { 
        checked: false,
        ...data,
        subtasks: []
    };

    listData.push(taskData);

    const task = document.createElement("task-node");
    task.dataset.index = listData.length - 1;
    listContainer.append(task);
};

export const getTaskContent = function (index) {
    return listData[index];
}

const listData = [];

const listContainer = document.querySelector(".list__container");
let tasks = JSON.parse(localStorage.getItem("taskTrackerData")) || [];

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const pendingList = document.getElementById("pendingList");
const completedList = document.getElementById("completedList");
const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");
const pendingEmpty = document.getElementById("pendingEmpty");
const completedEmpty = document.getElementById("completedEmpty");

function saveToLocalStorage() {
    localStorage.setItem("taskTrackerData", JSON.stringify(tasks));
}

function formatDate(isoString) {
    const d = new Date(isoString);
    return d.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

function renderTasks() {
    pendingList.innerHTML = "";
    completedList.innerHTML = "";

    let pendingCounter = 0;
    let completedCounter = 0;

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.className = "task-item";
        li.dataset.id = task.id;

        if (task.completed) {
            completedCounter++;
        } else {
            pendingCounter++;
        }

        const timeLabel = task.completed && task.completedAt
            ? `Completed: ${formatDate(task.completedAt)}`
            : `Added: ${formatDate(task.createdAt)}`;

        li.innerHTML = `
      <div class="task-main">
        <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
        <span class="task-text ${task.completed ? "completed" : ""}">${escapeHtml(task.text)}</span>
      </div>
      <div class="task-meta">
        <span class="timestamp">${timeLabel}</span>
        <div class="task-actions">
          <button type="button" class="btn-small btn-edit">Edit</button>
          <button type="button" class="btn-small btn-delete">Delete</button>
        </div>
      </div>
    `;

        if (task.completed) {
            completedList.appendChild(li);
        } else {
            pendingList.appendChild(li);
        }
    });

    pendingCount.textContent = `${pendingCounter} pending`;
    completedCount.textContent = `${completedCounter} completed`;

    pendingEmpty.style.display = pendingCounter === 0 ? "block" : "none";
    completedEmpty.style.display = completedCounter === 0 ? "block" : "none";
}

function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = taskInput.value.trim();

    if (!text) return;

    const newTask = {
        id: Date.now().toString(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.unshift(newTask);
    saveToLocalStorage();
    renderTasks();
    taskInput.value = "";
});

function handleListClick(e) {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;

    const taskId = taskItem.dataset.id;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    if (e.target.classList.contains("task-checkbox")) {
        task.completed = e.target.checked;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveToLocalStorage();
        renderTasks();
    }

    if (e.target.classList.contains("btn-delete")) {
        tasks = tasks.filter(t => t.id !== taskId);
        saveToLocalStorage();
        renderTasks();
    }

    if (e.target.classList.contains("btn-edit")) {
        const mainDiv = taskItem.querySelector(".task-main");
        const textSpan = taskItem.querySelector(".task-text");
        const editBtn = e.target;

        if (editBtn.textContent === "Edit") {
            const currentText = task.text;
            const input = document.createElement("input");
            input.type = "text";
            input.className = "edit-input";
            input.value = currentText;

            mainDiv.replaceChild(input, textSpan);
            input.focus();
            editBtn.textContent = "Save";

            const commitChange = () => {
                const updatedVal = input.value.trim();
                if (updatedVal) {
                    task.text = updatedVal;
                    saveToLocalStorage();
                }
                renderTasks();
            };

            input.addEventListener("keydown", (event) => {
                if (event.key === "Enter") commitChange();
            });
        } else {
            const input = taskItem.querySelector(".edit-input");
            if (input) {
                const updatedVal = input.value.trim();
                if (updatedVal) {
                    task.text = updatedVal;
                    saveToLocalStorage();
                }
            }
            renderTasks();
        }
    }
}

pendingList.addEventListener("click", handleListClick);
completedList.addEventListener("click", handleListClick);

renderTasks();
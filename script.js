document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements select karna
  const taskTitleInput =
    document.getElementById("taskTitle") ||
    document.querySelector('input[placeholder="Task Title"]');
  const taskDescInput =
    document.getElementById("taskDesc") ||
    document.querySelector("textarea") ||
    document.querySelector('input[placeholder="Task Description"]');
  const addTaskBtn =
    document.getElementById("addTaskBtn") ||
    document.querySelector(".btn-primary") ||
    document.querySelector("button");
  const searchInput = document.getElementById("searchInput");
  const taskList =
    document.getElementById("taskList") || document.querySelector(".task-list");

  // LocalStorage se tasks load karna
  let tasks = JSON.parse(localStorage.getItem("studentTasks")) || [
    {
      id: 1,
      title: "Review Git Workflow",
      desc: "Inspect branches, commits, and pull requests.",
      completed: false,
    },
  ];

  // Tasks save aur render karne ka main function
  function saveAndRender() {
    localStorage.setItem("studentTasks", JSON.stringify(tasks));
    renderTasks();
  }

  // UI par tasks display aur filter karne ka logic
  function renderTasks() {
    if (!taskList) return;

    const searchQuery = searchInput
      ? searchInput.value.toLowerCase().trim()
      : "";
    taskList.innerHTML = "";

    // Search filter condition
    const filteredTasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery) ||
        task.desc.toLowerCase().includes(searchQuery),
    );

    if (filteredTasks.length === 0) {
      taskList.innerHTML = `<p style="text-align: center; color: #888; margin-top: 15px;">No tasks found.</p>`;
      return;
    }

    filteredTasks.forEach((task) => {
      const taskCard = document.createElement("div");
      taskCard.className = `task-card ${task.completed ? "completed" : ""}`;
      taskCard.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #ffffff;
                padding: 12px 16px;
                margin-bottom: 10px;
                border-radius: 6px;
                border: 1px solid #e1e4e8;
                box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            `;

      taskCard.innerHTML = `
                <div style="flex: 1; margin-right: 12px;">
                    <h4 style="margin: 0 0 4px 0; color: #24292e; text-decoration: ${task.completed ? "line-through" : "none"}; opacity: ${task.completed ? "0.6" : "1"};">
                        ${task.title}
                    </h4>
                    <p style="margin: 0; color: #586069; font-size: 13px; text-decoration: ${task.completed ? "line-through" : "none"}; opacity: ${task.completed ? "0.6" : "1"};">
                        ${task.desc}
                    </p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="complete-btn" style="background-color: #2ea44f; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        ${task.completed ? "Undo" : "Complete"}
                    </button>
                    <button class="delete-btn" style="background-color: #d73a49; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        Delete
                    </button>
                </div>
            `;

      // Complete button action
      taskCard.querySelector(".complete-btn").addEventListener("click", () => {
        task.completed = !task.completed;
        saveAndRender();
      });

      // Delete button action
      taskCard.querySelector(".delete-btn").addEventListener("click", () => {
        tasks = tasks.filter((t) => t.id !== task.id);
        saveAndRender();
      });

      taskList.appendChild(taskCard);
    });
  }

  // Naya task add karne ka function
  function addNewTask() {
    const title = taskTitleInput ? taskTitleInput.value.trim() : "";
    const desc = taskDescInput ? taskDescInput.value.trim() : "";

    if (!title) {
      alert("Please enter a task title!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      desc: desc || "No description provided.",
      completed: false,
    };

    tasks.unshift(newTask);
    saveAndRender();

    // Form fields clear karna
    if (taskTitleInput) taskTitleInput.value = "";
    if (taskDescInput) taskDescInput.value = "";
  }

  // Event Listeners
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addNewTask();
    });
  }

  // Search bar typing listener (instant filter)
  if (searchInput) {
    searchInput.addEventListener("input", renderTasks);
  }

  // Initial render
  renderTasks();
});

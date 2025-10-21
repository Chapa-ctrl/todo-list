const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const categorySelect = document.getElementById("categorySelect");
const newCategory = document.getElementById("newCategory");
const addCategoryBtn = document.getElementById("addCategory");
const deleteCategoryBtn = document.getElementById("deleteCategory");
const themeToggle = document.getElementById("themeToggle");
const sortTasksBtn = document.getElementById("sortTasks");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let categories = JSON.parse(localStorage.getItem("categories")) || ["All"];

function saveData() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("categories", JSON.stringify(categories));
}

function renderCategories() {
    categorySelect.innerHTML = "";
    categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
}

function renderTasks() {
    const selectedCat = categorySelect.value;
    taskList.innerHTML = "";
    tasks
        .filter(task => selectedCat === "All" || task.category === selectedCat)
        .forEach((task, index) => {
            const li = document.createElement("li");
            li.className = task.completed ? "completed" : "";
            li.innerHTML = `
        <span>${task.text} <small>(${task.category})</small></span>
        <div class="actions">
          <button onclick="toggleComplete(${index})">✓</button>
          <button onclick="editTask(${index})">✏️</button>
          <button onclick="deleteTask(${index})">🗑️</button>
        </div>
      `;
            taskList.appendChild(li);
        });
}

function addTask() {
    const text = taskInput.value.trim();
    const category = categorySelect.value;
    if (text === "") return alert("Enter a task");
    tasks.push({ text, category, completed: false });
    taskInput.value = "";
    saveData();
    renderTasks();
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveData();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveData();
    renderTasks();
}

function editTask(index) {
    const newText = prompt("Edit your task:", tasks[index].text);
    if (newText !== null && newText.trim() !== "") {
        tasks[index].text = newText.trim();
        saveData();
        renderTasks();
    }
}

function addCategory() {
    const cat = newCategory.value.trim();
    if (cat === "" || categories.includes(cat)) return;
    categories.push(cat);
    newCategory.value = "";
    saveData();
    renderCategories();
}

function deleteCategory() {
    const cat = categorySelect.value;
    if (cat === "All") return alert("You can’t delete the 'All' category.");
    if (!confirm(`Delete category "${cat}" and its tasks?`)) return;

    // Remove the category
    categories = categories.filter(c => c !== cat);

    // Remove tasks that belong to it
    tasks = tasks.filter(t => t.category !== cat);

    saveData();
    renderCategories();
    renderTasks();
}

sortTasksBtn.addEventListener("click", () => {
    tasks.sort((a, b) => a.text.localeCompare(b.text));
    saveData();
    renderTasks();
});

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

function loadTheme() {
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark");
    }
}

addCategoryBtn.addEventListener("click", addCategory);
deleteCategoryBtn.addEventListener("click", deleteCategory);
document.getElementById("addTask").addEventListener("click", addTask);
categorySelect.addEventListener("change", renderTasks);

loadTheme();
renderCategories();
renderTasks();

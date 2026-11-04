const form = document.getElementById("todo-form");
const titleInput = document.getElementById("todo-title");
const prioritySelect = document.getElementById("todo-priority")
const list = document.getElementById("todo-list");

async function loadTodos() {
  const res = await fetch(`${API_URL}/todos`);
  const todos = await res.json();

  list.innerHTML = "";
  for (const todo of todos) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.addEventListener("change", () => toggleTodo(todo.id));

    const span = document.createElement("span");
    span.textContent = todo.title;
    if (todo.done) span.classList.add("done");

    const priorityBadge = document.createElement("span");
    span.textContent = todo.priority
    span.classList.add("badge")

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteTodo(todo.id));

    li.append(checkbox, span, priorityBadge, deleteBtn);
    list.append(li);
  }
}

async function addTodo(title, priority) {
  await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, priority }),
  });
  await loadTodos();
}

async function toggleTodo(id) {
  await fetch(`${API_URL}/todos/${id}`, { method: "PATCH" });
  await loadTodos();
}

async function deleteTodo(id) {
  await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
  await loadTodos();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = titleInput.value.trim();
  const priority = prioritySelect.value.trim()
  if (!title || !priority) return;
  addTodo(title, priority);
  titleInput.value = "";
});

loadTodos();

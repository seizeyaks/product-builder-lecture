document.addEventListener('DOMContentLoaded', () => {
    const addTodoForm = document.getElementById('add-todo-form');
    const newTodoInput = document.getElementById('new-todo-input');
    const todoList = document.getElementById('todo-list');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Load initial data
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    const currentTheme = localStorage.getItem('theme');

    // Theme initialization
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.textContent = '☀️';
    }

    // Theme Toggle Handler
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDark = body.classList.contains('dark-mode');
        themeToggle.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });

    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            if (todo.completed) {
                li.classList.add('completed');
            }

            const span = document.createElement('span');
            span.className = 'todo-text';
            span.textContent = todo.text;
            span.onclick = () => toggleTodo(index);

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => deleteTodo(index);

            li.appendChild(span);
            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }

    function addTodo(text) {
        if (text.trim()) {
            todos.push({ text: text.trim(), completed: false });
            saveTodos();
            renderTodos();
        }
    }

    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        saveTodos();
        renderTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
    }

    addTodoForm.onsubmit = (e) => {
        e.preventDefault();
        addTodo(newTodoInput.value);
        newTodoInput.value = '';
    };

    renderTodos();
});
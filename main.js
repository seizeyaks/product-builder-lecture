document.addEventListener('DOMContentLoaded', () => {
    const addTodoForm = document.getElementById('add-todo-form');
    const newTodoInput = document.getElementById('new-todo-input');
    const todoList = document.getElementById('todo-list');

    let todos = [];

    function renderTodos() {
        todoList.innerHTML = '';
        todos.forEach((todo, index) => {
            const li = document.createElement('li');
            li.textContent = todo.text;
            if (todo.completed) {
                li.classList.add('completed');
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.classList.add('delete-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                deleteTodo(index);
            });

            li.addEventListener('click', () => {
                toggleCompleted(index);
            });

            li.appendChild(deleteBtn);
            todoList.appendChild(li);
        });
    }

    function addTodo(text) {
        if (text.trim() !== '') {
            todos.push({ text, completed: false });
            renderTodos();
        }
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        renderTodos();
    }

    function toggleCompleted(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    }

    addTodoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo(newTodoInput.value);
        newTodoInput.value = '';
    });

    renderTodos();
});

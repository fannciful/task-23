'use strict';
import { getAllTodos, addTodo, updateTodo, deleteTodo } from './api.js';

const todoInputEl = document.querySelector('.todo-input');
const addBtnEl = document.querySelector('.add-todo-btn');

const todoListEl = document.querySelector('.todo-list');
let todoList = [];

getAllTodos()
    .then(list => {
        todoList.push(...list);
        todoList.forEach(todo => {
            createTodoItem(todo, todoListEl)
        })
    });

function createTodoItem({ text, id }, parent) {
    const itemEl = document.createElement('li');
    itemEl.className = 'todo-list-item';
    itemEl.id = id;
    itemEl.innerHTML = `<span class="todo-list-item-text">${text}</span>
        <button class="edit-todo-btn">Редагувати</button>
        <button class="delete-todo-btn">Видалити</button>`;

    parent.append(itemEl);
}


addBtnEl.addEventListener('click', async () => {
    const newTaskText = todoInputEl.value.trim();
    if (!newTaskText) {
        return;
    }

    const id = await addTodo(newTaskText);
    const newTask = { id, text: newTaskText };
    todoList.push(newTask);
    createTodoItem(newTask, todoListEl);
    todoInputEl.value = '';
});


todoListEl.addEventListener('click', async event => {
    event.stopPropagation();
    const { target } = event;
    const todoItemEl = target.closest('.todo-list-item');
    const todoItem = todoList.find(task => task.id === todoItemEl.id);
    switch (target.className) {
        case 'delete-todo-btn': {
            if (confirm(`Ти добре подумав і хочеш видалити '${todoItem.text} ?`)) {
                await deleteTodo(todoItemEl.id);
                todoItemEl.remove();
                todoList = todoList.filter(task => task.id !== todoItemEl.id);
            }
            break;
        }

        case 'edit-todo-btn': {
            const taskText = todoItemEl.querySelector('.todo-list-item-text').textContent;
            todoItemEl.innerHTML = `<input class="todo-list-item-text" value="${taskText}"/>
            <button class="save-todo-btn">Зберегти</button>
            <button class="cancel-todo-btn">Закрити</button>`;
            break;
        }

        case 'save-todo-btn': {
            const updatedTaskText = target.previousElementSibling.value.trim();
            if (!updatedTaskText) {
                return;
            }

            await updateTodo(todoItemEl.id, updatedTaskText);
            todoItem.text = updatedTaskText;
            todoItemEl.innerHTML = `<span class="todo-list-item-text">${updatedTaskText}</span>
            <button class="edit-todo-btn">Редагувати</button>
            <button class="delete-todo-btn">Видалити</button>`;
            break;
        }

        case 'cancel-todo-btn': {
            todoItemEl.innerHTML = `<span class="todo-list-item-text">${todoItem.text}</span>
            <button class="edit-todo-btn">Редагувати</button>
            <button class="delete-todo-btn">Видалити</button>`;
            break;
        }
    }
});

// Функція для отримання всіх задач
export async function getAllTodos() {
    const resp = await fetch('/list', {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    });

    return await resp.json();
}

// Функція для додавання нової задачі
export async function addTodo(text) {
    const resp = await fetch('/list-item', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })  // Передаємо об'єкт з текстом
    });

    return await resp.json();
}

// Функція для оновлення задачі
export async function updateTodo(id, text) {
    const resp = await fetch(`/list-item/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })  // Передаємо оновлений текст у форматі JSON
    });

    return await resp.json();
}

// Функція для видалення задачі
export async function deleteTodo(id) {
    const resp = await fetch(`/list-item/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json'
        }
    });

    return await resp.json();
}

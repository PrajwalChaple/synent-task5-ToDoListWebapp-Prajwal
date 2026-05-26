document.addEventListener('DOMContentLoaded', () => {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const tasksContainer = document.getElementById('tasks-list');

  let tasks = [];

  function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem('taskflow_tasks');
    tasks = storedTasks ? JSON.parse(storedTasks) : [];
  }

  function saveTasksToStorage() {
    localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
  }

  loadTasksFromStorage();
});
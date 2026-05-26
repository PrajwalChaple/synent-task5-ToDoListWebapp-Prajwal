/**
 * Taskflow - Premium Vanilla JS To-Do List Web App
 * Designed with modern Dribbble aesthetics, sleek animations, and full LocalStorage state sync.
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const tasksContainer = document.getElementById('tasks-list');
  const greetingTitle = document.getElementById('greeting-title');
  const greetingSubtitle = document.getElementById('greeting-subtitle');
  const currentDateEl = document.getElementById('current-date');
  
  // Progress panel elements
  const progressRatio = document.getElementById('progress-ratio');
  const progressIndicator = document.getElementById('progress-indicator');
  const progressPercent = document.getElementById('progress-percent');
  
  // Filters
  const filterAll = document.getElementById('filter-all');
  const filterPending = document.getElementById('filter-pending');
  const filterCompleted = document.getElementById('filter-completed');
  const filterButtons = document.querySelectorAll('.filter-btn');

  // --- State Variables ---
  let tasks = [];
  let currentFilter = 'all'; // 'all' | 'pending' | 'completed'

  // --- Initialize App ---
  function init() {
    loadTasksFromStorage();
    setupDateTime();
    updateGreetings();
    setupEventListeners();
    render();
  }

  // --- LocalStorage Integration ---
  function loadTasksFromStorage() {
    try {
      const storedTasks = localStorage.getItem('taskflow_tasks');
      tasks = storedTasks ? JSON.parse(storedTasks) : [
        // Default tasks for a premium onboarding feel if storage is empty
        { id: '1', text: 'Welcome to Taskflow! ✨', completed: false },
        { id: '2', text: 'Click the circle to mark a task as completed', completed: true },
        { id: '3', text: 'Try deleting this task using the trash button', completed: false }
      ];
      if (!storedTasks) {
        saveTasksToStorage();
      }
    } catch (e) {
      console.error('Error reading localStorage data', e);
      tasks = [];
    }
  }

  // --- Safe LocalStorage Write ---
  function saveTasksToStorage() {
    try {
      localStorage.setItem('taskflow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  }

  // --- Set Current Date ---
  function setupDateTime() {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const today = new Date();
    currentDateEl.textContent = today.toLocaleDateString('en-US', options);
  }

  // --- Dynamic Greeting Generator ---
  function updateGreetings() {
    const hour = new Date().getHours();
    let salutation = 'Hello';
    let subtitle = "Let's accomplish your targets today!";

    if (hour < 12) {
      salutation = 'Good morning, Creator ☀️';
      subtitle = 'Start your day fresh and productive.';
    } else if (hour < 17) {
      salutation = 'Good afternoon, Builder ⚡';
      subtitle = 'Keep up the excellent momentum!';
    } else if (hour < 21) {
      salutation = 'Good evening, Achiever 🌆';
      subtitle = 'Let us wrap up today\'s goals.';
    } else {
      salutation = 'Settle in, Planner 🌙';
      subtitle = 'Time to plan ahead for tomorrow.';
    }

    greetingTitle.textContent = salutation;
    greetingSubtitle.textContent = subtitle;
  }

  // --- Utility: Safe HTML Escaping ---
  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Progress Updates ---
  function updateProgress() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    
    // Update ratio text
    progressRatio.textContent = `${completed} of ${total} completed`;
    
    // Update progress bar & percentage text
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    progressIndicator.style.width = `${percentage}%`;
    progressPercent.textContent = `${percentage}%`;
  }

  // --- Rendering Functions ---
  function render() {
    updateProgress();
    
    // Filter tasks based on current filter state
    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
      filteredTasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
      filteredTasks = tasks.filter(t => t.completed);
    }

    // Clear existing container content
    tasksContainer.innerHTML = '';

    // Render Empty State if no tasks match
    if (filteredTasks.length === 0) {
      renderEmptyState();
      return;
    }

    // Render Task Elements
    filteredTasks.forEach(task => {
      const taskEl = createTaskDOMElement(task);
      tasksContainer.appendChild(taskEl);
    });
  }

  // Generate HTML for Empty States
  function renderEmptyState() {
    let title = 'All Caught Up!';
    let desc = 'Add a new task above to get started with your day.';
    let iconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    `;

    if (currentFilter === 'pending') {
      title = 'Everything Complete!';
      desc = 'You have completed all pending tasks. Outstanding work! 🎉';
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 12h8"></path>
          <path d="M12 8v8"></path>
        </svg>
      `;
    } else if (currentFilter === 'completed') {
      title = 'No Finished Tasks';
      desc = 'Complete some of your tasks above to view them here. 💪';
      iconSvg = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      `;
    }

    const emptyStateEl = document.createElement('div');
    emptyStateEl.className = 'empty-state';
    emptyStateEl.innerHTML = `
      <div class="empty-icon">
        ${iconSvg}
      </div>
      <h3 class="empty-title">${title}</h3>
      <p class="empty-desc">${desc}</p>
    `;
    tasksContainer.appendChild(emptyStateEl);
  }

  // Create single task DOM item
  function createTaskDOMElement(task) {
    const item = document.createElement('div');
    item.className = `task-item ${task.completed ? 'completed' : ''}`;
    item.setAttribute('data-id', task.id);
    item.setAttribute('role', 'listitem');

    item.innerHTML = `
      <div class="task-left">
        <label class="checkbox-container" aria-label="Toggle task completion">
          <input type="checkbox" ${task.completed ? 'checked' : ''}>
          <span class="checkmark">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </span>
        </label>
        <span class="task-content">${escapeHTML(task.text)}</span>
      </div>
      <button class="delete-btn" aria-label="Delete task">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    `;

    return item;
  }

  // --- Add Task Handler ---
  function addTask(text) {
    const cleanText = text.trim();
    if (!cleanText) return;

    const newTask = {
      id: Date.now().toString(),
      text: cleanText,
      completed: false
    };

    tasks.unshift(newTask); // Add to the top of the list
    saveTasksToStorage();
    render();
  }

  // --- Setup Event Handlers ---
  function setupEventListeners() {
    // 1. Submit Form to Add Task
    todoForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = todoInput.value;
      if (text.trim()) {
        addTask(text);
        todoInput.value = '';
        todoInput.focus();
      }
    });

    // 2. Click Delegation on Tasks Container
    tasksContainer.addEventListener('click', (e) => {
      const taskItem = e.target.closest('.task-item');
      if (!taskItem) return;
      
      const taskId = taskItem.getAttribute('data-id');

      // Clicked Delete Button
      if (e.target.closest('.delete-btn')) {
        e.stopPropagation();
        triggerDeleteAnimation(taskItem, taskId);
        return;
      }

      // Clicked Checkbox or Task Left Section (toggles completion status)
      if (e.target.closest('.task-left') || e.target.closest('.checkbox-container')) {
        toggleTaskCompletion(taskId);
      }
    });

    // 3. Filter Pill Switching
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const filterType = e.target.getAttribute('data-filter');
        if (currentFilter === filterType) return;

        // Switch active UI pill state
        filterButtons.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');

        currentFilter = filterType;
        render();
      });
    });

    // Refresh layout state on storage change (tabs in sync)
    window.addEventListener('storage', (e) => {
      if (e.key === 'taskflow_tasks') {
        loadTasksFromStorage();
        render();
      }
    });
  }

  // Toggle completion helper
  function toggleTaskCompletion(id) {
    tasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    saveTasksToStorage();
    render();
  }

  // Delete flow with CSS fade and scale transition
  function triggerDeleteAnimation(element, id) {
    element.classList.add('removing');
    
    // Wait for the fade-out CSS keyframes animation to complete
    element.addEventListener('animationend', (e) => {
      if (e.animationName === 'fadeOutDown') {
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToStorage();
        render();
      }
    });

    // Fallback in case of animation interference
    setTimeout(() => {
      if (tasks.some(task => task.id === id)) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasksToStorage();
        render();
      }
    }, 380);
  }

  // --- Launch App ---
  init();
});
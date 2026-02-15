// Default tasks shown when there is nothing in localStorage
const initialTasks = [
  "Review pending items",
  "Respond to messages",
  "Work on priority tasks",
  "Take a short break",
  "Do something active",
  "Watch something for fun",
];

// Key for localStorage
const STORAGE_KEY = 'todoData';

// Load tasks from localStorage safely
function loadTodoItems() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialTasks;
  } catch (error) {
    // If localStorage data is broken, fallback to defaults
    return initialTasks;
  }
}

// Save tasks to localStorage
function saveTodoItems(taskList) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(taskList));
}

// Collect all task texts currently displayed in the DOM
function getRenderedTasks() {
  const textElements = document.querySelectorAll('.to-do__item-text');
  return Array.from(textElements).map(el => el.textContent);
}

// Empty state message element
const emptyMessage = document.createElement('p');
emptyMessage.textContent = 'No tasks yet';
emptyMessage.style.textAlign = 'center';
emptyMessage.style.color = '#777';
emptyMessage.style.marginTop = '40px';

// Show or hide empty state message
function toggleEmptyState() {
  const tasks = getRenderedTasks();
  if (tasks.length === 0) {
    if (!todoList.contains(emptyMessage)) {
      todoList.after(emptyMessage);
    }
  } else {
    emptyMessage.remove();
  }
}

// Create a new todo item from the template
function createTodoElement(text) {
  const template = document.querySelector('#to-do__item-template');
  const node = template.content.cloneNode(true);

  const textNode = node.querySelector('.to-do__item-text');
  textNode.textContent = text;

  const deleteBtn = node.querySelector('.to-do__item-button_type_delete');
  const duplicateBtn = node.querySelector('.to-do__item-button_type_duplicate');
  const editBtn = node.querySelector('.to-do__item-button_type_edit');

  // Delete task
  deleteBtn.addEventListener('click', (e) => {
    e.target.closest('.to-do__item').remove();
    saveTodoItems(getRenderedTasks());
    toggleEmptyState();
  });

  // Duplicate task
  duplicateBtn.addEventListener('click', () => {
    const duplicated = createTodoElement(textNode.textContent);
    todoList.prepend(duplicated);
    saveTodoItems(getRenderedTasks());
    toggleEmptyState();
  });

  // Enable editing mode
  editBtn.addEventListener('click', () => {
    textNode.contentEditable = 'true';
    textNode.focus();
  });

  // Disable editing mode and save only if text changed
  textNode.addEventListener('blur', () => {
    textNode.contentEditable = 'false';

    const updatedTasks = getRenderedTasks();
    const savedTasks = loadTodoItems();

    // Save only if something actually changed
    if (JSON.stringify(updatedTasks) !== JSON.stringify(savedTasks)) {
      saveTodoItems(updatedTasks);
    }
  });

  // Finish editing on Enter
  textNode.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textNode.blur();
    }
  });

  return node;
}

// DOM elements
const todoList = document.querySelector('.to-do__list');
const todoForm = document.querySelector('.to-do__form');
const todoInput = document.querySelector('.to-do__input');

// Initial render
loadTodoItems().forEach(task => {
  todoList.append(createTodoElement(task));
});

// Show empty state if needed on load
toggleEmptyState();

// Handle new task submission
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const value = todoInput.value.trim();

  // Prevent adding empty or space-only tasks
  if (!value.length) return;

  todoList.prepend(createTodoElement(value));
  saveTodoItems(getRenderedTasks());
  toggleEmptyState();

  todoInput.value = '';
});
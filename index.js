// Default tasks shown when there is nothing in localStorage
const initialTasks = [
  "Review pending items",
  "Respond to messages",
  "Work on priority tasks",
  "Take a short break",
  "Do something active",
  "Watch something for fun",
];

// Load tasks from localStorage
// If nothing is saved yet, return the default list
function loadTodoItems() {
  const saved = localStorage.getItem('todoData');
  return saved ? JSON.parse(saved) : initialTasks;
}

// Save current tasks to localStorage
function saveTodoItems(taskList) {
  localStorage.setItem('todoData', JSON.stringify(taskList));
}

// Collect all task texts currently displayed in the DOM
function getRenderedTasks() {
  const textElements = document.querySelectorAll('.to-do__item-text');
  return Array.from(textElements).map(el => el.textContent);
}

// Create a new todo item from the template
function createTodoElement(text) {
  const template = document.querySelector('#to-do__item-template');
  const node = template.content.cloneNode(true);

  // Set task text
  const textNode = node.querySelector('.to-do__item-text');
  textNode.textContent = text;

  // Buttons
  const deleteBtn = node.querySelector('.to-do__item-button_type_delete');
  const duplicateBtn = node.querySelector('.to-do__item-button_type_duplicate');
  const editBtn = node.querySelector('.to-do__item-button_type_edit');

  // Delete task
  deleteBtn.addEventListener('click', (e) => {
    e.target.closest('.to-do__item').remove();
    saveTodoItems(getRenderedTasks());
  });

  // Duplicate task
  duplicateBtn.addEventListener('click', () => {
    const duplicated = createTodoElement(textNode.textContent);
    todoList.prepend(duplicated);
    saveTodoItems(getRenderedTasks());
  });

  // Enable editing mode
  editBtn.addEventListener('click', () => {
    textNode.contentEditable = 'true';
    textNode.focus();
  });

  // Disable editing mode and save on blur
  textNode.addEventListener('blur', () => {
    textNode.contentEditable = 'false';
    saveTodoItems(getRenderedTasks());
  });

  // Save edit when Enter is pressed
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

// Render tasks on page load
loadTodoItems().forEach(task => {
  todoList.append(createTodoElement(task));
});

// Handle new task submission
todoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const value = todoInput.value.trim();
  if (!value) return;

  // Add new task to the top of the list
  todoList.prepend(createTodoElement(value));

  // Save updated list
  saveTodoItems(getRenderedTasks());

  // Clear input field
  todoInput.value = '';
});

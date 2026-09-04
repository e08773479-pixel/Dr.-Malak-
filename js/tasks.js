document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const tasksList = document.getElementById('tasksList');
  const completedTasksStats = document.getElementById('completedTasksStats');

  let tasks = JSON.parse(localStorage.getItem('dr_malak_tasks')) || [];

  function saveAndRender() {
    localStorage.setItem('dr_malak_tasks', JSON.stringify(tasks));
    renderTasks();
  }

  function renderTasks() {
    if (!tasksList) return;
    tasksList.innerHTML = '';
    let completedCount = 0;

    tasks.forEach((task, index) => {
      if (task.completed) completedCount++;

      const taskDiv = document.createElement('div');
      taskDiv.className = `task ${task.completed ? 'completed' : ''}`;
      taskDiv.innerHTML = `
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask(${index})">
        <span>${task.text}</span>
        <button class="delete-task" onclick="deleteTask(${index})">×</button>
      `;
      tasksList.appendChild(taskDiv);
    });

    if (completedTasksStats) {
      completedTasksStats.textContent = completedCount;
    }
  }

  window.toggleTask = (index) => {
    tasks[index].completed = !tasks[index].completed;
    saveAndRender();
  };

  window.deleteTask = (index) => {
    tasks.splice(index, 1);
    saveAndRender();
  };

  addTaskBtn?.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      taskInput.value = '';
      saveAndRender();
    }
  });

  renderTasks();
});

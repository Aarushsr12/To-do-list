document.addEventListener('DOMContentLoaded', function () {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    loadTasks();

    addTaskBtn.addEventListener('click', function () {
        const task = taskInput.value;
        if (task) {
            addTask(task);
            taskInput.value = '';
        }
    });

    function loadTasks() {
        chrome.storage.sync.get(['tasks'], function (result) {
            const tasks = result.tasks || [];
            tasks.forEach(task => addTaskToDOM(task));
        });
    }

    function addTask(task) {
        addTaskToDOM(task);
        saveTask(task);
    }

    //Seperation of concerns
    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.textContent = task;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.addEventListener('click', function () {
            taskList.removeChild(li);
            removeTask(task);
        });

        li.appendChild(removeBtn);
        taskList.appendChild(li);
    }

    function saveTask(task) {
        chrome.storage.sync.get(['todos'], function (result) {
          const todos = result.todos || [];
          todos.push(task);
          chrome.storage.sync.set({ todos }, function() {
            console.log('Task saved to storage:', todos);
          });
        });
      }
      
    function removeTask(task) {
        chrome.storage.sync.get(['tasks'], function (result) {
            let tasks = result.tasks || [];
            tasks = tasks.filter(t => t !== task);
            chrome.storage.sync.set({ tasks });
        });
    }
});

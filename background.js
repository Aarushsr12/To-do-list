chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTodos') {
      chrome.storage.sync.get(['todos'], (result) => {
        //fetch the todo task from storage
        sendResponse({ todos: result.todos || [] });
      });
    }
    else if (request.action === 'addTodo') {
      chrome.storage.sync.get(['todos'], (result) => {
        const todos = result.todos || [];
        todos.push(request.todo);
        chrome.storage.sync.set({ todos }, () => {
          sendResponse({ todos });
          chrome.tabs.query({}, (tabs) => {
            tabs.forEach((tab) => {
              chrome.tabs.sendMessage(tab.id, { action: 'updateTodos', todos });
            });
          });
        });
      });
    }
    return true;
  });
  
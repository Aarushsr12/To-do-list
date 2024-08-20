window.addEventListener("message", (event) => {
    if (event.source !== window){
        return;
    }
    
    console.log("Received message from React app:", event.data);
  
    if (event.data.type && event.data.type === "FROM_PAGE") {
      chrome.runtime.sendMessage(
        { action: event.data.action, todo: event.data.todo, todos: event.data.todos },
        (response) => {
          console.log("Sending response to React app", response);
          window.postMessage({ type: "FROM_EXTENSION", data: response }, "*");
        }
      );
    }
  });
  
  chrome.runtime.onMessage.addListener((message) => {
    console.log("Message from background to content script", message);
    if (message.action === 'updateTodos') {
     // updating the task added to the react web app
      window.postMessage({ type: "FROM_EXTENSION", data: { todos: message.todos } }, "*");
    }
  });
  
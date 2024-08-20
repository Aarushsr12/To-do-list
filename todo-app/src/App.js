import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    window.addEventListener("message", (event) => {
      
      if (event.source !== window) return;
      //data from extension
      if (event.data.type && event.data.type === "FROM_EXTENSION") {
        setTodos(event.data.data.todos || []);
      }
    });

    window.postMessage({ type: "FROM_PAGE", action: "getTodos" }, "*");

    return () => {
      window.removeEventListener("message", null);
    };
  }, []);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodo('');

    window.postMessage({ type: "FROM_PAGE", action: "addTodo", todo: newTodo }, "*");
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);

    window.postMessage({ type: "FROM_PAGE", action: "removeTodo", todos: updatedTodos }, "*");
  };

  return (
    <div className="App">
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Enter a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo} <button onClick={() => removeTodo(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

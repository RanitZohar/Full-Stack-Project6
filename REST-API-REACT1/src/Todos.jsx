import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, React } from "react";
import "./css/Todos.css";

export function Todos() {
  const [listUserTodos, setListUserTodos] = useState([]);
  const [userTodos, setUserTodos] = useState([]);
  const [sortingCriteria, setSortingCriteria] = useState("serial"); // to  track of the selected sorting criterion
  const [editingTodo, setEditingTodo] = useState(null); // state to track the todo id being edited
  const [newTitleTodo, setNewTitleTodo] = useState(""); // state to track the todo id being edited
  const userInfo = JSON.parse(localStorage.getItem("currentUser"));
  const [appearAdd, setAppearAdd] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    try {
      const userId = userInfo.id;
      const response = await fetch(`http://localhost:3000/todos/:${userId}`);
      if (!response.ok) {
        throw new Error("Request failed of todos");
      }
      const data = await response.json();
      // Process the received data
      console.log(data);
      setListUserTodos(data);
      setUserTodos(data);
    } catch (error) {
      // Handle any errors
      console.error("Error:", error);
    }
  };

  const handleCheckboxChange = async (todoId) => {
    try {
      let completedTodo;
      for (let i = 0; i < userTodos.length; i++) {
        if (userTodos[i].id === todoId) {
          completedTodo = userTodos[i].completed;
          break;
        }
      }

      const response = await fetch(
        `http://localhost:3000/todos/completed?id=${todoId}&completed=${!completedTodo}`,
        {
          method: "PUT",
        }
      );
      if (!response.ok) {
        throw new Error("Request failed for todos");
      }
      setListUserTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed: !todo.completed, // Toggle the completed state
            };
          }
          return todo;
        });
      });
      setUserTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              completed: !todo.completed, // Toggle the completed state
            };
          }
          return todo;
        });
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDeleteTodo = async (todoId) => {
    try {
      const response = await fetch(`http://localhost:3000/todos/:${todoId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Request failed for deleting todo");
      }
      const data = await response.json();
      console.log(data);
      setListUserTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo.id !== todoId);
      });
      setUserTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo.id !== todoId);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSortingChange = (event) => {
    // the function is created to update the sortingCriteria state when the select value changes
    setSortingCriteria(event.target.value);
  };
  const handleShowAccording = (event) => {
    // the function is created to update the ShowAccording state when the select value changes
    handleShowCompletedChange(event.target.value);
  };

  const sortUserTodos = () => {
    // the function return a sorted copy of the userTodos array based on the selected sorting criteria
    const sortedTodos = [...userTodos];

    if (sortingCriteria === "serial") {
      // return negative if a need to be sort befor b ,
      // positive value if a need to be sort after b ,
      // or 0 if a and b are considered equal in terms of sorting order
      sortedTodos.sort((a, b) => a.id - b.id);
    } else if (sortingCriteria === "performance") {
      sortedTodos.sort((a, b) => a.completed - b.completed);
    } else if (sortingCriteria === "alphabetical") {
      sortedTodos.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortingCriteria === "random") {
      sortedTodos.sort(() => Math.random() - 0.5); // will return number between 0.5 to -0.5 , and do a sort on that
    }
    return sortedTodos;
  };

  const sortedUserTodos = sortUserTodos();

  const handleShowCompletedChange = (selectedValue) => {
    setUserTodos(listUserTodos);
    if (selectedValue === "only_checked_boxes") {
      setUserTodos((prevTodos) => {
        return prevTodos.filter((todo) => todo.completed);
      });
    } else if (selectedValue === "only_not_checked_boxes") {
      setUserTodos((prevTodos) => {
        return prevTodos.filter((todo) => !todo.completed);
      });
    } else {
      setUserTodos(listUserTodos);
    }
  };

  const handleEditTodo = (todoId) => {
    setEditingTodo(todoId);
    const todoToEdit = userTodos.find((todo) => todo.id === todoId);
    setNewTitleTodo(todoToEdit.title); // Set initial value of the input field
  };
  const handleCancelEdit = () => {
    setEditingTodo(null);
  };

  const handleUpdateTodo = async (todoId, newTitle) => {
    try {
      const response = await fetch(
        `http://localhost:3000/todos/title?id=${todoId}&title=${newTitle}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Request failed for updating todo");
      }
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        console.log(data);
      }
      setListUserTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              title: newTitle,
            };
          }
          return todo;
        });
      });
      setUserTodos((prevTodos) => {
        return prevTodos.map((todo) => {
          if (todo.id === todoId) {
            return {
              ...todo,
              title: newTitle,
            };
          }
          return todo;
        });
      });
      setEditingTodo(null); // Reset editing state after updating
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const AppearAddTodo = () => {
    setAppearAdd(!appearAdd);
  };

  const AddTodo = async () => {
    const newTodo = {
      userId: userInfo.id,
      title: newTodoTitle,
      completed: false,
    };

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error("Failed to add new Todo");
      }
      const data = await response.json();
      console.log(data[0]);

      setNewTodoTitle("");
      setAppearAdd(false); // Déplacer cette ligne ici
      fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNewTodoTitleChange = (event) => {
    setNewTodoTitle(event.target.value);
  };

  return (
    <div className="todos_container">
      {/* the headLine of the page */}
      <h1 className="todos_header">{`${userInfo.name}`}`s Todos List:</h1>
      {/* the select tags */}
      <div className="select_section">
        <div className="sorting_section">
          <label htmlFor="sortingCriteria">Sort by:</label>
          <select
            id="sortingCriteria"
            value={sortingCriteria}
            onChange={handleSortingChange}
          >
            <option value="serial">Serial</option>
            <option value="performance">Performance</option>
            <option value="alphabetical">Alphabetical</option>
            <option value="random">Random</option>
          </select>
        </div>
        {/* the checkbox to show/hide completed tasks */}
        <div className="checkbox_section">
          <label htmlFor="showAccording">Show according:</label>
          <select id="showAccording" onChange={handleShowAccording}>
            <option value="all_the_todos">all the todos</option>
            <option value="only_checked_boxes">only checked boxes</option>
            <option value="only_not_checked_boxes">
              only not checked boxes
            </option>
          </select>
        </div>
      </div>
      <button className="addTodoButton" onClick={AppearAddTodo}>
        + Add Todo
      </button>
      {appearAdd ? (
        <div className="addTodoSection">
          <input
            type="text"
            placeholder="title"
            value={newTodoTitle}
            onChange={handleNewTodoTitleChange}
          ></input>
          <button className="AddNewTodo" onClick={AddTodo}>
            Add new Todo
          </button>
        </div>
      ) : (
        <div></div>
      )}
      {/* print the todos list */}
      {userTodos.length > 0 ? (
        <ol className="todos_list_user">
          {sortedUserTodos.map((todo) => (
            <li className="todo_item" key={todo.id}>
              {/* Todo Title */}
              <div className="todoTitle">{todo.title}</div>
              {/* Checkbox */}
              <input
                className="checkBoxTodo"
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleCheckboxChange(todo.id)}
              />
              {/* Delete Button */}
              <button
                className="deleteTodo"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                🗑
              </button>
              {/* Edit Button */}
              <div className="editTodo">
                {editingTodo === todo.id ? (
                  // Show input field for editing
                  <>
                    <input
                      type="text"
                      value={newTitleTodo}
                      onChange={(e) => setNewTitleTodo(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdateTodo(todo.id, newTitleTodo)}
                    >
                      Finish
                    </button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                  </>
                ) : (
                  // Show edit button
                  <button onClick={() => handleEditTodo(todo.id)}>✎</button>
                )}
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p className="loading_message">Loading...</p>
      )}
    </div>
  );
}

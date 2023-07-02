import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import { Todos } from "./Todos";
import { Posts } from "./Posts";
import "./css/Login.css";
import Info from "./Info";
import { async } from "q";
import Albums from "./Albums";
import Photos from "./Photos";
import Register from "./Register";
import { Navbar } from "react-bootstrap";
import { useEffect } from "react";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(0);
  const [isLogin, setIsLogin] = useState(false);
  const [buttonRegister, setButtonRegister] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleButtonRegister = () => {
    setButtonRegister(true);
    navigate("/register");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin") {
      setIsLogin(true);
      localStorage.setItem("currentUser", JSON.stringify(username));
    } else {
      try {
        const response = await fetch(
          `http://localhost:3000/users?username=${username}&password=${password}`
        );

        if (response.ok) {
          const data = await response.json();
          if (data.error) {
            // L'objet de réponse contient une propriété "error", donc c'est une erreur
            alert(data.error);
          } else {
            // L'objet de réponse ne contient pas de propriété "error", donc c'est un utilisateur valide
            setIsLogin(true);
            localStorage.setItem("currentUser", JSON.stringify(data[0]));
            setCurrentUser(data[0]);
            console.log("Réussi : utilisateur récupéré", data);
          }
        } else {
          // La requête s'est terminée avec un statut d'erreur
          alert(
            "An error occurred while fetching user data. Please try again."
          );
        }
      } catch (error) {
        // Une erreur s'est produite lors de l'exécution de la requête
        alert("An error occurred while fetching user data. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (isLogin) {
      navigate(`/users/${currentUser.name}`);
    }
  }, [isLogin, currentUser, navigate]);
  return (
    <div className="container">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <Link
        to={`/register`}
        className="button-link"
        onClick={handleButtonRegister}
      >
        Register
      </Link>
    </div>
  );
}

export default Login;

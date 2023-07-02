import { Routes, Route, Link, NavLink, Outlet } from "react-router-dom";
import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "react-bootstrap";

import "./css/Main.css";

export const EssaiContext = createContext();

export function Main() {
  const user = JSON.parse(localStorage.getItem("currentUser"));
  const [current_user, setCurrentUser] = useState(user);
  const [resourceType, setResourceType] = useState("");
  const navigate = useNavigate();

  function Logout(event) {
    event.preventDefault(); // Prevent default navigation behavior
    navigate("/login");
    localStorage.removeItem("currentUser");
  }
  return (
    <div>
      {" "}
      <Navbar className={"navbar"}>
        {current_user && (
          <p className={"welcome"}>Welcome {current_user.name}!</p>
        )}
        <NavLink
          className={"NavLink"}
          to="albums"
          onClick={() => setResourceType("albums")}
        >
          Albums
        </NavLink>
        <NavLink
          className={"NavLink"}
          to="posts"
          onClick={() => setResourceType("posts")}
        >
          Posts
        </NavLink>
        <NavLink
          className={"NavLink"}
          to="todos"
          onClick={() => setResourceType("todos")}
          replace
        >
          Todos
        </NavLink>
        <NavLink className={"NavLink"} to="infos">
          Info
        </NavLink>
        <NavLink className={"NavLink"} onClick={Logout}>
          Logout
        </NavLink>
      </Navbar>
      <Outlet />
    </div>
  );
}

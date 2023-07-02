import "./css/App.css";
import React, { Component } from "react";
import { Link, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import {Main} from "./Main";
import {Redirect} from "./Redirect";
import { Info } from "./Info";
import {Albums}  from "./Albums";
import {Posts} from "./Posts"
import { Todos } from "./Todos";
import {Photos} from "./Photos"


function App() {
  
  return (
      <Routes>
         <Route path="/" element={<Redirect />} />
         <Route path="login" element={<Login />} />
         <Route path="register" element={<Register />} />
         <Route path="users/:name" element={<Main />}>
         <Route path="infos" element={<Info/>}/>
         <Route path="albums" element={<Albums/>}/>
         <Route path="albums/:albumId/photos"  element={<Photos/>}/>
          <Route path="posts" element={<Posts/>}/>
          <Route path="todos" element={<Todos/>}/>
         </Route>
      </Routes>
  );
}

export default App;

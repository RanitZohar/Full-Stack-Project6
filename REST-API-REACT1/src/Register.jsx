import ReactDOM from "react-dom";
import { useParams } from "react-router-dom";
import { useState, useEffect, React } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Login";
import { Todos } from "./Todos";
import { Posts } from "./Posts";
import "./css/Register.css";
import Info from "./Info";
import { async } from "q";
import Albums from "./Albums";
import Photos from "./Photos";
import { Navbar } from "react-bootstrap";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [streetname, setStreetname] = useState("");
  const [apartname, setApartname] = useState("");
  const [city, setCity] = useState("");
  const [phoneNum, setphoneNum] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [givenUserId, setGivenUserId] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handleStreetnameChange = (e) => {
    setStreetname(e.target.value);
  };
  const handleApartnameChange = (e) => {
    setApartname(e.target.value);
  };
  const handleCityChange = (e) => {
    setCity(e.target.value);
  };
  const handlePhoneNumChange = (e) => {
    setphoneNum(e.target.value);
  };
  const handleWebsiteChange = (e) => {
    setWebsite(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleButtonLogin = () => {
    // navigate("./login");
    navigate(-2);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const newUser = {
      name: name,
      username: username,
      email: email,
      street: streetname,
      suite: apartname,
      city: city,
      phone: phoneNum,
      website: website,
    };

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("An error occurred while adding a new user.");
      }

      const data = await response.json();
      const newUserId = data[0].id; // get id from user
      setCurrentUser(data[0]);
      console.log(newUserId);
      setGivenUserId(newUserId);

      const new_user_pass = {
        userId: newUserId,
        password: password,
      };

      const response1 = await fetch("http://localhost:3000/users_passwords", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new_user_pass),
      });

      if (!response1.ok) {
        throw new Error("An error occurred while adding a new user_password.");
      }

      const data1 = await response1.json();
      localStorage.setItem("currentUser", JSON.stringify(data[0]));
      setIsRegister(true);
      console.log("registration succeeded");
      // pass to login pages
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  if (isRegister) {
    navigate(`/users/:${currentUser.name}`);
  } else {
    return (
      <div className="container">
        <form onSubmit={handleRegister}>
          <label id="head-line"> Register to the OUR WEB:</label>
          <label>enter a full name:</label>
          <input
            type="text"
            minLength={3}
            maxLength={20}
            value={name}
            onChange={handleNameChange}
            placeholder=" הכנס שם מלא (נא להכניס בין 3 ל20 תווים)"
            required
          />
          <label>enter a username</label>
          <input
            type="text"
            minLength={3}
            maxLength={10}
            value={username}
            onChange={handleUsernameChange}
            placeholder="הכנס שם משתמש (נא להכניס בין 3 ל10 תווים)"
            required
          />
          <label>enter your email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="email הכנס כתובת"
            required
          />
          <label>enter your address street name:</label>
          <input
            type="text"
            minLength={3}
            maxLength={20}
            value={streetname}
            onChange={handleStreetnameChange}
            placeholder="הכנס שם רחוב מגורים"
            required
          />
          <label>enter your apartment number:</label>
          <input
            type="text"
            minLength={5}
            maxLength={15}
            value={apartname}
            onChange={handleApartnameChange}
            placeholder="הכנס מספר דירה כך 'Suite\Apt. 556' "
            required
          />
          <label>enter your city address:</label>
          <input
            type="text"
            minLength={3}
            maxLength={15}
            value={city}
            onChange={handleCityChange}
            placeholder="הכנס שם עיר מגורים"
            required
          />
          <label>enter your phone number:</label>
          <input
            type="tel"
            pattern="\d{10}"
            value={phoneNum}
            onChange={handlePhoneNumChange}
            placeholder="הכנס מספר טלפון (10 ספרות בדיוק)"
            required
          />
          <label>enter your website:</label>
          <input
            type="url"
            placeholder="https://example.com"
            pattern="https://.*"
            size="30"
            value={website}
            onChange={handleWebsiteChange}
            required
          />
          <div className="form-group">
            <label>enter a password</label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="הכנס סיסמא"
              minLength={4}
              maxLength={15}
              required
            />
          </div>
          <button type="submit">register</button>
        </form>
        <Link to={`/login`} className="button-link" onClick={handleButtonLogin}>
          Login
        </Link>
      </div>
    );
  }
}

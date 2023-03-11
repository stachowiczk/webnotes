import React, { useEffect, useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import Register from "./Register";
import axios from "axios";
import http from "./Interceptor";

function Login({}) {
  const [userData, setUserData] = React.useState({
    username: "",
    password: "",
  });

  const [isLoaded, setIsLoaded] = React.useState(false);

  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  

 

  const handleChange = (e) => {
    e.preventDefault();
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  async function submit(e) {
    e.preventDefault();

    dispatch({ type: "LOADING" });

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:5000/auth/login",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },

        // set the json data to the value of the text state
        withCredentials: true,
        data: JSON.stringify({
          username: userData.username,
          password: userData.password,
        }),
      });
      const data = await response.data;

      if (response.status === 200) {
        dispatch({ type: "LOGIN_SUCCESS", payload: data });
        navigate("/");
      } else {
        dispatch({ type: "LOGIN_FAIL" });
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "LOGIN_FAIL" });
    }
  }

  React.useEffect(() => {
    async function checkLoggedIn() {
        dispatch({ type: "LOADING" });
        try {
          const res = await http.get("http://localhost:5000/auth/login", {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Credentials": "true",
            },
          });
          if (res.status === 200) {
            dispatch({ type: "USER_LOADED", payload: res.data });
            navigate("/home");
          } else {
            dispatch({ type: "LOGIN_FAIL" });
            setIsLoaded(true);
          }
        } catch (err) {
          console.log(err);
          dispatch({ type: "LOGIN_FAIL" });
        }
      setIsLoaded(true);
      }
    checkLoggedIn();
    setUserData({ username: "", password: "" });
    return () => {
      Promise.resolve();
    };
  }, []);

  if (!isLoaded) {
    return (
      <div style={formStyle}>
        <h1>Loading...</h1>
      </div>
    );
  } else if (state.isAuthenticated) {
    return (
      <div style={formStyle}>
        <h1>You are already logged in.</h1>
      </div>
    );
  } else {
    return (
      <div style={formStyle}>
        <h1>Login</h1>
        <form onSubmit={submit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>
        <Link to="/register">Need and account? Register here!</Link>
      </div>
    );
  }
}
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginRight: "20vw",
  marginLeft: "auto",
};
export default Login;

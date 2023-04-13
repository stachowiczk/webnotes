import React, { useContext } from "react";
import { AuthContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import http from "./Interceptor";

function Login() {
  const [userData, setUserData] = React.useState({
    username: "",
    password: "",
  });

  const [isLoaded, setIsLoaded] = React.useState(false);
  const currentTheme = useSelector((state) => state.theme.theme);

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

  // this prevents the user from seeing the login page if they are already logged in
  React.useEffect(() => {
    async function checkLoggedIn() {
      dispatch({ type: "LOADING" });
      try {
        const res = await http.get("http://localhost:5000/auth/login");
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
  }, [dispatch, navigate]);

  React.useEffect(() => {
    document.title = "WebNotes Login";
  }, []);

  if (!isLoaded) {
    return (
      <div id="login-container">
        <div className={`loading ${currentTheme}`}></div>
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
      <div className={`root-element ${currentTheme}`}>
        <div id="login-container">
          <form className="form" id="login-form" onSubmit={submit}>
            <div id="register-form-label-main">Log in to WebNotes</div>
            <input
              type="text"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Username"
            />
            <input
              type="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
              placeholder="Password"
            />
            <button className="submit" id="login" type="submit">
              Login
            </button>
            Need an account?{" "}
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "black" }}
            >
              Register here!
            </Link>
          </form>
        </div>
      </div>
    );
  }
}
const formStyle = {};
export default Login;

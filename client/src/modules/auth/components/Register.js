import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import http from "./Interceptor";


function Register() {
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    repeatPassword: "",
  });
  const [pwMatch, setPwMatch] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const currentTheme = useSelector((state) => state.theme.theme);
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    e.preventDefault();
    setUserData({ ...userData, [e.target.name]: e.target.value });
    if (
      userData.password === userData.repeatPassword &&
      userData.password !== ""
    ) {
      setPwMatch(true);
    } else {
      setPwMatch(false);
    }
  };

  useEffect(() => {
    checkAvailable();
    return () => {
      setIsAvailable(true);
      Promise.resolve();
    };
  }, [userData.username]);

  useEffect(() => {
    if (
      userData.password === userData.repeatPassword &&
      userData.password !== ""
    ) {
      setPwMatch(true);
    } else {
      setPwMatch(false);
    }
  }, [userData.repeatPassword, userData.password]);

  const checkAvailable = () => {
    axios({
      method: "get",
      url: "http://localhost:5000/auth/register?username=" + userData.username,
      headers: { "Content-Type": "application/json" },
    }).then((res) => {
      if (res.data[1] === 409) {
        console.log(res.data);
        setIsAvailable(false);
      } else {
        setIsAvailable(true);
      }
    });
  };

  function submit(e) {
    e.preventDefault();
    if (!pwMatch || !isAvailable) {
      return;
    }
    axios({
      method: "post",
      url: "http://localhost:5000/auth/register",
      headers: { "Content-Type": "application/json" },
      // set the json data to the value of the text state
      data: JSON.stringify({
        username: userData.username,
        password: userData.password,
      }),
    }).then((res) => {
      console.log(res.data);
      navigate("/login");
    });
  }
  useEffect(() => {
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
    setUserData({ username: "", password: "", repeatPassword: "" });
  }, []);
  if (!isLoaded) {
    return (
      <div id="login-container">
        <div className={`loading ${currentTheme}`}></div>;
      </div>
    );
  } else if (state.isAuthenticated) {
    return <Navigate to="/home" />;
  } else {
    return (
      <div className={`root-element ${currentTheme}`}>
        <div id="login-container">
          <form className="form" id="register-form" onSubmit={submit}>
            <div id="register-form-label-main">Create a WebNotes Account</div>
            <label htmlFor="username" style={labelStyle}>
              {isAvailable && " "}
              {!isAvailable && "Username is not available"}
            </label>
            <input
              type="text"
              placeholder="Username"
              name="username"
              id="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Confirm Password"
              name="repeatPassword"
              onChange={handleChange}
            />
            <label htmlFor="repeatPassword" style={labelStyle}>
              {pwMatch && " "}
              {!pwMatch && userData.password !== "" && "Passwords do not match"}
            </label>
            <button className="submit" id="register" type="submit">
              Register
            </button>
            Already have an account?
            <Link
              to="/login"
              style={{ textDecoration: "none", color: "black" }}
            >
              Login
            </Link>
          </form>
        </div>
      </div>
    );
  }
}

const labelStyle = {
  flex: "0",
  color: "red",
  minHeight: "1em",
  marginTop: "0em",
  fontSize: "0.9em",
};

export default Register;

import React, { useEffect } from "react";
import Register from "./Register";
import axios from "axios";

function Login({ isLoaded, setIsLoaded }) {
  const [userData, setUserData] = React.useState({
    username: "",
    password: "",
  });


  const handleChange = (e) => {
    e.preventDefault();
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  function submit(e) {
    e.preventDefault();
    axios({
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
    }).then((res) => {
      console.log(res.data);
      setIsLoaded((isLoaded) => !isLoaded);
    });
  }

  React.useEffect(() => {
    setUserData({ username: "", password: "" });
    setIsLoaded(true);
  }, []);

  return (
    <div>
      <form onSubmit={submit} style={formStyle}>
        <input type="text" name="username" onChange={handleChange} />
        <input type="password" name="password" onChange={handleChange} />
        <button type="submit">Login</button>
      </form>
      
    </div>
  );
}
const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  marginRight: "20vw",
  marginLeft: "auto",
};
export default Login;

import axios from "axios";
import React, { useEffect } from "react";

function Register() {
  const [userData, setUserData] = React.useState({
    username: "",
    password: "",
  });
  const [isAvailable, setIsAvailable] = React.useState(true);
  const [isLoaded, setIsLoaded] = React.useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    checkAvailable();
    return () => {
      setIsAvailable(true);
    };
  }, [userData]);

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
    });
  }
  React.useEffect(() => {
    setUserData({ username: "", password: "" });
    setIsLoaded(true);
  }, []);
  if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <div style={{ height: "2em" }}>
          <label
            htmlFor="username"
            style={isAvailable ? hideLabel : labelStyle}
          >
            Username is not available
          </label>
        </div>
        <form onSubmit={submit} style={formStyle}>
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
          <button type="submit">Register</button>
        </form>
      </>
    );
  }
}

const hideLabel = {
  display: "none",
  position: "relative",
  right: "-10px",
};

const labelStyle = {
  color: "red",
  position: "relative",
  right: "-10px",
};

const formStyle = {
  display: "flex",
  gap: "10px",
  marginRight: "20vw",
  marginLeft: "auto",
  padding: "10px",
};

export default Register;

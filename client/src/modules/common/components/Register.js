import axios from "axios";
import React from "react";

function Register() {
  const [userData, setUserData] = React.useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
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
    setUserData({username: "", password: ""})
  }, [])
  return (
    <>
      <form onSubmit={submit}>
        <input type="text" name="username" onChange={handleChange} />
        <input type="password" name="password" onChange={handleChange} />
        <button type="submit">Register</button>
      </form>
    </>
  );
}

export default Register;

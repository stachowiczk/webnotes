import React from 'react'
import axios from 'axios'

function Login() {
    const [userData, setUserData] = React.useState({
        username: '',
        password: '',
    })

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value })
    }
    function submit (e) {
        e.preventDefault();
        axios({
            method: 'post',
            url: 'http://localhost:5000/auth/login',
            headers: { 'Content-Type': 'application/json' },
            // set the json data to the value of the text state
            data: JSON.stringify({ username: userData.username, password: userData.password }),
        }).then((res) => {
            document.cookie = `token=${res.data.token}`
        }) }


  return (
    <div>
        <form onSubmit={submit}>
            <input type="text" name="username" onChange={handleChange} />
            <input type="password" name="password" onChange={handleChange} />
            <button type="submit">Login</button>
        </form>

    </div>
  )
}

export default Login
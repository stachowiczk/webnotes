import React, {useEffect} from "react";
import {
  BrowserRouter,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import { AuthContextProvider } from "../context/UserContext";
import PrivateRoute from "./PrivateRoute";
import Homee from "./Homee";
import Home from "./Home";
import Login from "../../common/components/Login";
import Register from "../../common/components/Register";
import Logout from "../../common/components/Logout";
import Editor from "../../common/components/Editor";
import axios from "axios";

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Homee />} /> //this only checks the current login status and sets state accordingly

          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="/register" element={<Register />} />
        </Routes>
        <Link to="/login">Login </Link>
        <Link to="/home">Home</Link>
        <Link to="/logout">Logout</Link>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;

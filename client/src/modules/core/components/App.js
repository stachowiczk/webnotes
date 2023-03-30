import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContextProvider } from "../../auth/context/UserContext";
import PrivateRoute from "../../auth/components/PrivateRoute";
import Redirect from "./Redirect";
import Home from "./Home";
import Login from "../../auth/components/Login";
import Register from "../../auth/components/Register";
import Logout from "../../auth/components/Logout";

function App() {

 
  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Redirect />} />
          <Route path="/login" element={<Login />} />
          <Route element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route path="/logout" element={<Logout />} />
          </Route>
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  );
}

export default App;

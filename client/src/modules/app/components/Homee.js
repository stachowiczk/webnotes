import React, { useEffect, useState, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import axios from "axios";
import http from "./Interceptor";

function Homee() {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

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
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        navigate("/home");
      } else {
        dispatch({ type: "LOGIN_FAIL" });
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
      dispatch({ type: "LOGIN_FAIL" });
      navigate("/login");
    }
  }

  useEffect(() => {
    checkLoggedIn();
  }, []);

  if (state.isLoaded) {
    if (state.isAuthenticated === true) {
      return (<></>)
    } 
  } else {
    return <div>Loading...</div>;
  }
}

export default Homee;

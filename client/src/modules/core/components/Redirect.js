import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/context/UserContext";
import http from "../../auth/components/Interceptor";

function Redirect() {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  async function checkLoggedIn(dispatch, navigate) {
    dispatch({ type: "LOADING" });
    try {
      const res = await http.get("http://localhost:5000/auth/login", {
        withCredentials: true,
      });
      if (res.status === 200) {
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
        navigate("/home");
      } else {
        handleLoginFailure();
      }
    } catch (err) {
      console.error(err);
      handleLoginFailure();
    }
  }

  function handleLoginFailure() {
    dispatch({ type: "LOGIN_FAIL" });
    navigate("/login");
  }

  useEffect(() => {
    checkLoggedIn(dispatch, navigate);
  }, [dispatch, navigate]);

  
  if (state.isAuthenticated) {
    return <></>;
  }
}

export default Redirect;

import axios from "axios";
import { useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import http from "./Interceptor";

function Logout() {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  async function logout() {
    dispatch({ type: "LOADING" });

    try {
      const response = await http({
        method: "get",
        url: "http://localhost:5000/auth/logout",
      });
      const data = await response.data;
      if (response.status === 200 || response.status === 401) {
        dispatch({ type: "LOGOUT_SUCCESS" });
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "LOGOUT_SUCCESS" });
      navigate("/login");
    }
  }

  useEffect(() => {
    logout();
  }, []);

  return state.isAuthenticated ? null : <Navigate to="/login" />;
}

export default Logout;

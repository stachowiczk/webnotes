import axios from "axios";
import { useEffect, useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import http from "./Interceptor";
import * as cfg from "../../../config.js"
function Logout() {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();
  async function logout() {
    dispatch({ type: "LOADING" });

    try {
      const response = await http({
        method: "get",
        url: `${cfg.API_BASE_URL}${cfg.AUTH_LOGOUT_ENDPOINT}`
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

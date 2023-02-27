import axios from "axios";
import { useEffect, useContext } from "react";
import { Navigate, useNavigate} from "react-router-dom";
import { AuthContext } from "../../app/context/UserContext";

function Logout() {
  const { state, dispatch } = useContext(AuthContext);
  const navigate = useNavigate()
  async function logout() {
    dispatch({ type: "LOADING" });

    try {
      const response = await axios({
        method: "delete",
        url: "http://localhost:5000/auth/login",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        withCredentials: true,
      });
      const data = await response.data;
      if (response.status === 200) {
        dispatch({ type: "LOGOUT_SUCCESS" });
        navigate("/login");

      }
    } catch (error) {
      console.log(error);
      dispatch({ type: "LOGOUT_FAIL" });
      navigate("/");
    }
  }

  useEffect(() => {
    logout();
  }, []);

  return state.isAuthenticated ? null : <Navigate to="/login" />;
}

export default Logout;

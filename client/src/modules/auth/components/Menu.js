import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/UserContext";

function Menu() {
  //eslint-disable-next-line
  const { state, dispatch } = useContext(AuthContext);

  return (
    <div
      className="user-button"
      style={{ border: "none" }}
    >
      <div
        className="menu-button"
        style={{}}
      >
        <>{state.isAuthenticated ? null : <Link to="/login">Login </Link>}</>
        <Link to="/logout">Confirm </Link>
      </div>
    </div>
  );
}

export default Menu;

import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../common/slices/themeSlice";

function Menu() {
  //eslint-disable-next-line
  const { state, dispatch } = useContext(AuthContext);
  

  return (
    <div className="user-button" style={{}}>
      <div className="menu-button" style={{}}>
        <>{state.isAuthenticated ? null : <Link to="/login">Login </Link>}</>
        <Link to="/logout">Confirm </Link>
      </div>
    </div>
  );
}

export default Menu;

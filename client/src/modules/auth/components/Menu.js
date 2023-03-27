import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/UserContext";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../common/slices/themeSlice";

function Menu() {
  //eslint-disable-next-line
  const { state, dispatch } = useContext(AuthContext);
  const theme = useSelector((state) => state.theme.theme);
  const themeDispatch = useDispatch();

  function handleTheme () {
    themeDispatch(toggleTheme());
  }

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
        <button onClick={handleTheme}>Theme</button>
      </div>
    </div>
  );
}

export default Menu;

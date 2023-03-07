import { useContext, useEffect } from "react";
import { AuthContext } from "../context/UserContext";
import { Outlet, Route, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  const { state } = useContext(AuthContext);
  return state.isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

// the "/" path checks login status and applies the appropriate redirect

//syntax/how to use:
// <Route  element={<PrivateRoute/>} />
//   <Route path"/path" element={<ProtectedElementHere/>} />
// </Route>

export default PrivateRoute;

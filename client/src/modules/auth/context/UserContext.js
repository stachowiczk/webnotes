import React, { createContext, useState, useReducer } from "react";

const initialState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "USER_LOADED":
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
        user: action.payload[0],
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload[0],
        isAuthenticated: true,
        isLoading: false,
      };
    case "REGISTER_SUCCESS":
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        isLoading: false,
      };
    case "AUTH_ERROR":
    case "LOGIN_FAIL":
    case "LOGOUT_SUCCESS":
    case "REGISTER_FAIL":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "LOGOUT_FAIL":
      return {
        ...state,
        isLoading: false,
      };
    case "LOADING":
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
};

export const AuthContext = createContext({
  state: initialState,
  dispatch: () => null,
});

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

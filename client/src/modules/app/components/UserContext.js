import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const useUserContext = () => {
  const [user, setUser] = useState({});

  return {
    user,
    setUser,
  };
};

export const UserProvider = ({ children }) => {
  const context = useUserContext();

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};

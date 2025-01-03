import React, { createContext, useReducer, useEffect } from "react";

const INITIAL_STATE = {
  user: null,
  loading: false,
  error: null,
};

export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, user: null, loading: true, error: null };
    case "LOGIN_SUCCESS":
      return { ...state, user: action.payload, loading: false, error: null };
    case "LOGIN_FAILURE":
      return { ...state, user: null, loading: false, error: action.payload };
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

const loadFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem("authState");
    return serializedState ? JSON.parse(serializedState) : INITIAL_STATE;
  } catch (e) {
    console.error("Could not load state from localStorage", e);
    return INITIAL_STATE;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, undefined, loadFromLocalStorage);

  // Save state to localStorage whenever it changes
  React.useEffect(() => {
    try {
      localStorage.setItem("authState", JSON.stringify(state));
    } catch (e) {
      console.error("Could not save state to localStorage", e);
    }
  }, [state]);

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        loading: state.loading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useReducer, useEffect } from "react";

const INITIAL_STATE = {
  user:null,
  loading:false,
  error:null,
};



export const AuthContext = createContext(INITIAL_STATE);

const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_START":
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {}, loadFromLocalStorage);

  return (
    <AuthContext.Provider
      value={{
        city: state.city,
        date: state.date,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

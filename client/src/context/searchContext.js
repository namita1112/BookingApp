import { createContext, useReducer, useEffect } from "react";

const INITIAL_STATE = {
  city: undefined,
  date: [],
  options: {
    adult: undefined,
    children: undefined,
    room: undefined,
  },
};

// Load state from local storage
const loadFromLocalStorage = () => {
  const storedState = localStorage.getItem("searchContext");
  return storedState ? JSON.parse(storedState) : INITIAL_STATE;
};

export const SearchContext = createContext(INITIAL_STATE);

const SearchReducer = (state, action) => {
  switch (action.type) {
    case "NEW_SEARCH":
      return action.payload;
    case "RESET_SEARCH":
      return INITIAL_STATE;
    default:
      return state;
  }
};

export const SearchContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(SearchReducer, {}, loadFromLocalStorage);

  // Save state to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("searchContext", JSON.stringify(state));
  }, [state]);

  return (
    <SearchContext.Provider
      value={{
        city: state.city,
        date: state.date,
        options: state.options,
        dispatch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

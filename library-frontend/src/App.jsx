// components
import Router from "./router";
import NavBar from "./components/NavBar";
import { useReducer } from "react";

// reducer & context
import tokenReducer from "./reducers/tokenReducer";
import TokenContext from "./context/TokenContext";

const App = () => {
  const [token, dispatch] = useReducer(
    tokenReducer,
    localStorage.getItem("library-user-token") || null
  );

  return (
    <div>
      <TokenContext.Provider value={{ token, dispatch }}>
        <NavBar />
        <Router />
      </TokenContext.Provider>
    </div>
  );
};

export default App;

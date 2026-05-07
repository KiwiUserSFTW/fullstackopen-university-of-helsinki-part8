// apollo
import { useSubscription } from "@apollo/client/react";

// queries
import { BOOK_ADDED } from "./queries";

// components
import Router from "./router";
import NavBar from "./components/NavBar";
import { useReducer } from "react";

// reducer & context
import tokenReducer from "./reducers/tokenReducer";
import TokenContext from "./context/TokenContext";

// utils
import updateBookCache from "./utils/updateBookCache";

const App = () => {
  const [token, dispatch] = useReducer(
    tokenReducer,
    localStorage.getItem("library-user-token") || null,
  );

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data.data.bookAdded;
      alert(`new book ${addedBook.title} addded`);

      updateBookCache(client.cache, addedBook);
    },
    onError: (error) => {
      console.error(error);
    },
  });

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

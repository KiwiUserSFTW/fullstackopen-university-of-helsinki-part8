// react & router
import { useNavigate } from "react-router";
import { useContext } from "react";

// components
import Logout from "./Logout";
import TokenContext from "../context/TokenContext";

export function NavBar() {
  const { token } = useContext(TokenContext);

  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/authors")}>authors</button>
      <button onClick={() => navigate("/books")}>books</button>
      {token ? (
        <>
          <button onClick={() => navigate("/newBook")}>add book</button>
          <Logout />
        </>
      ) : (
        <button onClick={() => navigate("/login")}>login</button>
      )}
    </div>
  );
}

export default NavBar;

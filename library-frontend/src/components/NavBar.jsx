// react-router
import { useNavigate } from "react-router";

export function NavBar() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/authors")}>authors</button>
      <button onClick={() => navigate("/books")}>books</button>
      <button onClick={() => navigate("/newBook")}>add book</button>
    </div>
  );
}

export default NavBar;

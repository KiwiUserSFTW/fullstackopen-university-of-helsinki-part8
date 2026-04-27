import { Routes, Route } from "react-router-dom";

// components
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import { Navigate } from "react-router";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/authors"} />} />
      <Route path="/authors" element={<Authors />} />
      <Route path="/books" element={<Books />} />
      <Route path="/newBook" element={<NewBook />} />
    </Routes>
  );
};

export default Router;

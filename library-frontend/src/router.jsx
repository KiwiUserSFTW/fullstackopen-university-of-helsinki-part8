import { Routes, Route } from "react-router-dom";

// components
import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Login from "./components/Login";

import { Navigate } from "react-router";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={"/authors"} />} />
      <Route path="/authors" element={<Authors />} />
      <Route path="/books" element={<Books />} />
      <Route path="/newBook" element={<NewBook />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default Router;

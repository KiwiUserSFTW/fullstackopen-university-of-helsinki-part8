import { useApolloClient } from "@apollo/client/react";
import { useRemoveToken } from "../hooks/useToken";
import TokenContext from "../context/TokenContext";
import { useNavigate } from "react-router";

const Logout = () => {
  const client = useApolloClient();
  const removeToken = useRemoveToken(TokenContext);
  const navigate = useNavigate();

  const onLogout = () => {
    removeToken(null);
    localStorage.clear();
    client.resetStore();
    navigate("/");
  };

  return <button onClick={onLogout}>logout</button>;
};

export default Logout;

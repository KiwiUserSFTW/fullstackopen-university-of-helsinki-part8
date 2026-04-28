import { useContext } from "react";
import TokenContext from "../context/TokenContext";

import { removeToken, setToken } from "../reducers/tokenReducer";

export const useSetToken = () => {
  const { dispatch } = useContext(TokenContext);
  return (token) => dispatch(setToken(token));
};

export const useRemoveToken = () => {
  const { dispatch } = useContext(TokenContext);

  return () => dispatch(removeToken());
};

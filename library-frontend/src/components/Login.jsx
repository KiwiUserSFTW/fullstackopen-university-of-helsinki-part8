// react & router
import { useState } from "react";
import { useNavigate } from "react-router";

// server
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../queries";

import { useSetToken } from "../hooks/useToken";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const setToken = useSetToken();
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const submit = (event) => {
    event.preventDefault();

    try {
      login({ variables: { username, password } });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default Login;

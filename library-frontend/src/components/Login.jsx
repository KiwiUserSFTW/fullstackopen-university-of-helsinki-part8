// react & router
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// server
import { useMutation } from "@apollo/client/react";
import { LOGIN } from "../queries";

import { useSetToken } from "../hooks/useToken";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const setToken = useSetToken();
  const navigate = useNavigate();

  const [login] = useMutation(LOGIN, {
    onCompleted: (data) => {
      const token = data.login.value;
      setToken(token);
      setError(null);
      localStorage.setItem("library-user-token", token);
      navigate("/");
    },
    onError: (error) => {
      console.error(error);
      setError("Login failed");
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

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError(null);
      }, 5000);
    }
  }, [error]);

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label>
            username
            <input
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
      {error ? <div style={{ color: "red" }}> {error} </div> : ""}
    </div>
  );
};

export default Login;

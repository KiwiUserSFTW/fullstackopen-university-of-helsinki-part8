import { useQuery } from "@apollo/client/react";
import { useContext } from "react";

import { ALL_AUTHORS } from "../queries";
import EditAuthor from "./EditAuthor";
import TokenContext from "../context/TokenContext";

const Authors = () => {
  const result = useQuery(ALL_AUTHORS);
  const { token } = useContext(TokenContext);

  if (result.loading) return <> loading ...</>;

  const authors = result.data.allAuthors;
  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {token && <EditAuthor authors={authors} />}
    </div>
  );
};

export default Authors;

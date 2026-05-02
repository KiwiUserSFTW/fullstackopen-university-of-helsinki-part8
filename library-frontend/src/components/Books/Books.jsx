import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ALL_BOOKS_GENRES } from "../../queries";
import Bookfilters from "./BookFilters/Bookfilters";

const Books = () => {
  const [filter, setFilter] = useState(null);

  const books = useQuery(ALL_BOOKS, {
    variables: { genre: filter },
  });

  if (books.loading) return <> loading ...</>;

  return (
    <div>
      <h2>books</h2>
      {filter && <h3> in genre: {filter}</h3>}
      <Bookfilters setFilter={setFilter} />
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.data.allBooks.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Books;

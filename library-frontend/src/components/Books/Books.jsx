import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ALL_BOOKS_GENRES } from "../../queries";

import Bookfilters from "./BookFilters/BookFilters";
import BooksTable from "./BooksTable/BooksTable";

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
      <BooksTable books={books.data.allBooks} />
    </div>
  );
};

export default Books;

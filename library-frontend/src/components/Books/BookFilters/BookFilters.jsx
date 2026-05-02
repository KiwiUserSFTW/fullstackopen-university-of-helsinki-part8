import { useQuery } from "@apollo/client/react";
import { useMemo } from "react";
import { ALL_BOOKS_GENRES } from "../../../queries";

const Bookfilters = ({ setFilter }) => {
  const booksGenres = useQuery(ALL_BOOKS_GENRES);

  const filters = useMemo(() => {
    if (!booksGenres.data) return [];
    return [
      ...new Set(booksGenres.data.allBooks.flatMap((book) => book.genres)),
    ];
  }, [booksGenres.data]);

  if (booksGenres.loading) return <> loading ...</>;
  return (
    <div>
      {filters.map((filter) => (
        <button key={filter} onClick={() => setFilter(filter)}>
          {filter}
        </button>
      ))}
    </div>
  );
};

export default Bookfilters;

import { useQuery } from "@apollo/client/react";
import { ALL_BOOKS, ME } from "../../queries";
import BooksTable from "./BooksTable/BooksTable";

const FavoriteBooks = () => {
  const { data, loading } = useQuery(ME);

  const genre = data?.me.favoriteGenre || null;

  const books = useQuery(ALL_BOOKS, {
    variables: { genre: genre },
    skip: !genre,
  });

  if (loading || !genre || books.loading) return <> loading ...</>;

  return (
    <div>
      <h1> recommendations </h1>
      <p>
        books in your favorite genre <strong> {genre ? genre : ""}</strong>
      </p>
      <BooksTable books={books.data.allBooks} />
    </div>
  );
};

export default FavoriteBooks;

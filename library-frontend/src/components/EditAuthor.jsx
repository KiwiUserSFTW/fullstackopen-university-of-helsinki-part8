import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR_BIRDTHDAY } from "../queries";

const EditAuthor = ({ authors }) => {
  const [name, setName] = useState(authors[0].name || "");
  const [born, setBorn] = useState("");

  const [editAuthBorn] = useMutation(EDIT_AUTHOR_BIRDTHDAY, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    editAuthBorn({
      variables: { name, born: Number(born) },
    });

    setName("");
    setBorn("");
  };

  return (
    <div>
      <h2> Set birthyear </h2>
      <form onSubmit={handleSubmit}>
        <div>
          name
          <select
            name="authors"
            id="author-select"
            onChange={({ target }) => setName(target.value)}
          >
            {authors.map(({ name }) => (
              <option value={name} key={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
        <div>
          born
          <input
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  );
};

export default EditAuthor;

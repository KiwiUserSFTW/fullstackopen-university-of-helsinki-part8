const DataLoader = require("dataloader");

const authorBooksLoaderCreator = (Book) => {
  return new DataLoader(async (ids) => {
    const authorsBooks = await Book.find({});

    return ids.map((authorId) => {
      return authorsBooks.filter(
        (book) => String(book.author) === String(authorId)
      ).length;
    });
  });
};

module.exports = { authorBooksLoaderCreator };

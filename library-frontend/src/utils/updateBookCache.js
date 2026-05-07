const updateBookCache = (cache, book) => {
  // https://www.apollographql.com/docs/react/data/mutations#the-update-function

  cache.modify({
    fields: {
      allBooks(existing = [], { args }) {
        const bookExists = existing.some((b) => b.id === book.id);

        // prevent double updating
        if (bookExists) {
          return existing;
        }

        // skip updating cached list if the book doesn't match the active genre filter in the cache
        if (args?.genre && !book.genres.includes(args.genre)) {
          return existing;
        }

        return [...existing, book];
      },
    },
  });
};

export default updateBookCache;

const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");

// NOTE Redis Pub/Sub prod alternative
const { PubSub } = require("graphql-subscriptions");

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const userCheck = (user) => {
  if (!user) {
    throw new GraphQLError(`authentication error`, {
      extensions: {
        code: "BAD_USER_INPUT",
      },
    });
  }
};

const pubsub = new PubSub();

const resolvers = {
  Query: {
    me: async (root, args, context) => {
      const { currentUser } = context;
      // userCheck(currentUser)
      if (!currentUser) {
        return null;
      }

      return currentUser;
    },
    bookCount: async () => {
      try {
        const books = await Book.find({});
        return books.length;
      } catch (error) {
        throw new GraphQLError(`Counting books failed: ${error.message}`, {
          extensions: {
            code: "BOOK_COUNT_FAILED",
          },
        });
      }
    },
    authorCount: async () => {
      try {
        const authors = await Author.find({});
        return authors.length;
      } catch (error) {
        throw new GraphQLError(`Counting authors failed: ${error.message}`, {
          extensions: {
            code: "AUTHORS_COUNT_FAILED",
          },
        });
      }
    },
    allBooks: async (root, args) => {
      const filtersMap = [
        {
          name: "author",
          value: args.author,
          transform: async (value) => {
            const author = await Author.findOne({ name: value });

            if (!author) {
              throw new GraphQLError(`Author ${value} not exist`, {
                extensions: {
                  code: "BAD_USER_INPUT",
                  invalidArgs: value,
                },
              });
            }

            return author._id;
          },
        },
        {
          name: "genres",
          value: args.genres || args.genre,
          transform: (value) => {
            if (Array.isArray(value)) {
              return { $all: value };
            }
            return value;
          },
        },
      ];

      try {
        const books = async (queries = {}) =>
          await Book.find(queries).populate("author");
        const activeFilters = filtersMap.filter((filter) => filter.value);

        if (activeFilters.length === 0) return books();

        const queries = {};

        for (const filter of activeFilters) {
          const value = await filter.transform(filter.value);
          if (value) {
            queries[filter.name] = value;
          }
        }

        return books(queries);
      } catch (error) {
        throw new GraphQLError(`Failed to fetch books ${error.message}`, {
          extensions: {
            code: "ALL_BOOKS_QUERY_FAILED",
            error,
          },
        });
      }
    },
    allAuthors: async () => {
      try {
        const books = await Book.find({});
        const authors = await Author.find({});

        return authors.map((author) => {
          const bookCount = books.filter(
            (book) => String(book.author) === String(author._id),
          ).length;

          const { _id, ...args } = author.toObject();
          return { ...args, bookCount, id: _id };
        });
      } catch (error) {
        throw new GraphQLError(`Failed to fetch books ${error.message}`, {
          extensions: {
            code: "ALL_AUTHORS_QUERY_FAILED",
            error,
          },
        });
      }
    },
  },
  Mutation: {
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      try {
        return user.save();
      } catch (error) {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
    addBook: async (root, args, { currentUser }) => {
      userCheck(currentUser);

      let author = await Author.findOne({ name: args.author });
      if (!author) {
        const newAuthor = new Author({ name: args.author });
        try {
          await newAuthor.save();
        } catch (error) {
          throw new GraphQLError(`Adding user failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT_",
              invalidArgs: args.author,
            },
          });
        }

        author = newAuthor;
      }

      const book = new Book({ ...args, author: author.id });

      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(`Adding book failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
          },
        });
      }
      await book.populate("author");

      pubsub.publish("BOOK_ADDED", { bookAdded: book });
      return book;
    },
    editAuthor: async (root, args, { currentUser }) => {
      userCheck(currentUser);

      try {
        const updatedAuthor = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { returnDocument: "after" },
        );

        if (!updatedAuthor) {
          return null;
          /*
          throw new GraphQLError(`Author "${args.name}" not exist`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
            },
          });
          */
        }

        return updatedAuthor;
      } catch (error) {
        throw new GraphQLError(`Adding user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT_",
            invalidArgs: args,
            error,
          },
        });
      }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;

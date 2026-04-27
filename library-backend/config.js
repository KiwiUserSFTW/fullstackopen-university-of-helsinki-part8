const testEnv = process.env.NODE_ENV === "test";

const PORT = process.env.PORT;
const MONGODB_URI = testEnv
  ? process.env.MONGODB_URI_TEST
  : process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;

export default {
  PORT,
  MONGODB_URI,
  JWT_SECRET,
};

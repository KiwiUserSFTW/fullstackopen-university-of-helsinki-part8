export const tokenReducer = (state, action) => {
  switch (action.type) {
    case "SET_TOKEN":
      return action.payload;
    case "REMOVE_TOKEN":
      return null;
    default:
      return state;
  }
};

// actions
export const setToken = (token) => ({
  type: "SET_TOKEN",
  payload: token,
});

export const removeToken = () => ({
  type: "REMOVE_TOKEN",
});

export default tokenReducer;

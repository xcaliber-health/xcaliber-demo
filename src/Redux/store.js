import { createStore } from "redux";
const intialState = {
  source: "ATHENA",
};
const sourceReducer = (state = intialState, action) => {
  if (action.type === "ELATION") {
    return {
      source: "ELATION",
    };
  }
  if (action.type === "ATHENA") {
    return {
      source: "ATHENA",
    };
  }
  return state;
};
export default createStore(sourceReducer);

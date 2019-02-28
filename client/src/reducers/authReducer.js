import { TEST_DISPATCH } from "../actions/types";

const initialState = {
  isAuthenticated: false,
  user: {}
};
// ... means spread operator. it basically takes what is in something and adds onto it
export default function(state = initialState, action) {
  switch (action.type) {
    default:
      return state;
  }
}

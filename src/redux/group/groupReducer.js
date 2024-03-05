const initialState = {
  groupData: null,
};

export default function groupReducer(state = initialState, action) {
  switch (action.type) {
    case "GET_GROUP_SUCCESS":
      return { ...state, groupData: action.payload }; 
    default:
      return state;
  }
}

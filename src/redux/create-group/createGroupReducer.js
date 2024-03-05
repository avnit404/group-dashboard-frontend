const initialState = {
    groupData: null, // Initialize state to hold the fetched group data
  };
  
  export default function creteGroupReducer(state = initialState, action) {
    switch (action.type) {
      case "CRETAE_GROUP":
        return { ...state, groupData: action.payload }; 
      default:
        return state;
    }
  }
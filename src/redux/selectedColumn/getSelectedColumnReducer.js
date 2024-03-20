const initialState = {
    selectedColumn: null,
  };
  
  export default function getSelectedColumnReducer(state = initialState, action) {
    switch (action.type) {
      case "GET_SELECTED_COLUMN_SUCCESS":
        return { ...state, selectedColumn: action.payload }; 
      default:
        return state;
    }
  }
  
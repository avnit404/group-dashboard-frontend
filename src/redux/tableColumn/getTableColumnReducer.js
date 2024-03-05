const initialState = {
    tableColumn: null,
  };
  
  export default function getTableColumnReducer(state = initialState, action) {
    switch (action.type) {
      case "GET_TABLE_COLUMN_SUCCESS":
        return { ...state, tableColumn: action.payload }; 
      default:
        return state;
    }
  }
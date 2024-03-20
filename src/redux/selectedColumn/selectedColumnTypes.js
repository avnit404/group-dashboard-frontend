export const getSelectedColumn = (data) => ({
    type: 'GET_SELECTED_COLUMN_REQUEST', 
    payload: data
  });
  export const getSelectedColumnSuccess = (data) => ({
    type: 'GET_SELECTED_COLUMN_SUCCESS',
    payload: data,
  });
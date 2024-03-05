export const getTableAndColumn = () => ({
    type: 'GET_TABLE_COLUMN_REQUEST',
  });
  export const getTableAndColumnSuccess = (data) => ({
    type: 'GET_TABLE_COLUMN_SUCCESS',
    payload: data,
  });
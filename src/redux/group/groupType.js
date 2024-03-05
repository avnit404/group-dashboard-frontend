export const getGroup = () => ({
  type: 'GET_GROUP_REQUEST', 
});
export const getGroupSuccess = (data) => ({
  type: 'GET_GROUP_SUCCESS',
  payload: data,
});

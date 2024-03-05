
export const UPDATE_GROUP_REQUEST = 'UPDATE_GROUP_REQUEST';
export const UPDATE_GROUP_SUCCESS = 'UPDATE_GROUP_SUCCESS';
export const UPDATE_GROUP_FAILURE = 'UPDATE_GROUP_FAILURE';

export const updateGroupRequest = (data) => ({
  type: UPDATE_GROUP_REQUEST,
  payload: data,
});

export const updateGroupSuccess = (group) => ({
  type: UPDATE_GROUP_SUCCESS,
  payload: group,
});

export const updateGroupFailure = (error) => ({
  type: UPDATE_GROUP_FAILURE,
  payload: error,
});

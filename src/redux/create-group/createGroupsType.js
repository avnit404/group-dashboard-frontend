
export const CREATE_GROUP_REQUEST = 'CREATE_GROUP_REQUEST';
export const CREATE_GROUP_SUCCESS = 'CREATE_GROUP_SUCCESS';
export const CREATE_GROUP_FAILURE = 'CREATE_GROUP_FAILURE';

export const createGroupRequest = (data) => ({
  type: CREATE_GROUP_REQUEST,
  payload: data,
});

export const createGroupSuccess = (group) => ({
  type: CREATE_GROUP_SUCCESS,
  payload: group,
});

export const createGroupFailure = (error) => ({
  type: CREATE_GROUP_FAILURE,
  payload: error,
});

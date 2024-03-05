// groupSaga.js
import { put, call, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import { CREATE_GROUP_REQUEST, createGroupFailure, createGroupSuccess } from './createGroupsType';


function* createGroupSaga(action) {
  try {
    const response = yield call(axios.post, `${process.env.REACT_APP_BASE_URL}/group/createGroup`, action.payload);
    yield put(createGroupSuccess(response.data));
  } catch (error) {
    yield put(createGroupFailure(error));
  }
}

export function* watchCreateGroup() {
  yield takeLatest(CREATE_GROUP_REQUEST, createGroupSaga);
}
export function* createGroupSagas() {
    yield all([call(watchCreateGroup)]);
}
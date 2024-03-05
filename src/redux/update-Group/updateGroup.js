// groupSaga.js
import { put, call, takeLatest, all } from 'redux-saga/effects';
import axios from 'axios';
import { updateGroupFailure, updateGroupSuccess } from './updateGroupType';


function* updateGroupSaga(payload) {
  try {
    const response = yield call(axios.post(`${process.env.REACT_APP_BASE_URL}/group/updateGroup`, payload.payload));
    yield put(updateGroupSuccess(response.data));
  } catch (error) {
    yield put(updateGroupFailure(error));
  }
}

export function* watchUpdateGroup() {
  yield takeLatest("UPDATE_GROUP_REQUEST", updateGroupSaga);
}
export function* updateGroupSagas() {
    yield all([call(watchUpdateGroup)]);
}
import axios from "axios";
import { takeLatest, put, call, all } from "redux-saga/effects";
import { getGroupSuccess } from "./groupType";

export function* getAllGroups() {
  try {
    const response = yield axios.get(`${process.env.REACT_APP_BASE_URL}/group/getGroup`);
    yield put(getGroupSuccess(response.data.groups)); 
  } catch (error) {
    console.error(error);
  }
}

export function* watchGetAllGroups() {
  yield takeLatest("GET_GROUP_REQUEST", getAllGroups); 
}
export function* modelSagas() {
  yield all([call(watchGetAllGroups)]);
}
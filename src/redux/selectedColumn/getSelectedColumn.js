import axios from "axios";
import { takeLatest, put, call, all } from "redux-saga/effects";
import { getSelectedColumnSuccess } from "./selectedColumnTypes";

export function* getSelectedColumn(payload) {
    const {group,id} = payload.payload
  try {
    const response = yield axios.get(`${process.env.REACT_APP_BASE_URL}/group/${id}/tables/${group}/columns`);
    yield put(getSelectedColumnSuccess(response.data)); 
  } catch (error) {
    console.error(error);
  }
}

export function* watchGetSelectedColumns() {
  yield takeLatest("GET_SELECTED_COLUMN_REQUEST", getSelectedColumn); 
}
export function* getSelectedColumns() {
  yield all([call(watchGetSelectedColumns)]);
}
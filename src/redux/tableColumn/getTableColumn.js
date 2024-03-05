import axios from "axios";
import { takeLatest, put, call, all } from "redux-saga/effects";
import { getTableAndColumnSuccess } from "./tableColumnType";

export function* getAllTableColumn() {
  try {
    const response = yield axios.get(`${process.env.REACT_APP_BASE_URL}/group/getTableAndColumn`);
    yield put(getTableAndColumnSuccess(response.data)); 
  } catch (error) {
    console.error(error);
  }
}

export function* watchGetAllTableColumn() {
  yield takeLatest("GET_TABLE_COLUMN_REQUEST", getAllTableColumn); 
}
export function* tableColumnSagas() {
  yield all([call(watchGetAllTableColumn)]);
}
import { all, call } from 'redux-saga/effects';
import { modelSagas } from './group/getGroup';
import { createGroupSagas } from './create-group/createGroup';
import { updateGroupSagas } from './update-Group/updateGroup';
import { tableColumnSagas } from './tableColumn/getTableColumn';
import { getSelectedColumns } from './selectedColumn/getSelectedColumn';


export function* rootSaga() {
  yield all([call(modelSagas), call(createGroupSagas),call(updateGroupSagas),call(tableColumnSagas),call(getSelectedColumns)]);
}

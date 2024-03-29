import { combineReducers } from 'redux';

import groupReducer from './group/groupReducer';
import getTableColumnReducer from './tableColumn/getTableColumnReducer';
import creteGroupReducer from './create-group/createGroupReducer';
import getSelectedColumnReducer from './selectedColumn/getSelectedColumnReducer';

const rootReducer = combineReducers({
  groups: groupReducer,
  tableColumn:getTableColumnReducer,
  createGroup:creteGroupReducer,
  columns :getSelectedColumnReducer
});

export default rootReducer;
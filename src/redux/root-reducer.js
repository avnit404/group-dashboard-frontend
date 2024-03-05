import { combineReducers } from 'redux';

import groupReducer from './group/groupReducer';
import getTableColumnReducer from './tableColumn/getTableColumnReducer';
import creteGroupReducer from './create-group/createGroupReducer';

const rootReducer = combineReducers({
  groups: groupReducer,
  tableColumn:getTableColumnReducer,
  createGroup:creteGroupReducer
});

export default rootReducer;
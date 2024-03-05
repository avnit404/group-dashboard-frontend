import { createSelector } from 'reselect';

const groupReducer = (state) => state.data
export const selectAppointment = createSelector(
    [groupReducer],
    (group) => group.selectAppointment
);
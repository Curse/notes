import {createSelector} from 'reselect'

export const getState = state => state.userStatus

export const getUserIds = createSelector([getState], (users) => Object.keys(users))

export const makeGetUserById = (userId) => createSelector([getState], (users) => users[userId])
import * as types from './action-types'

export const setUserStatus = (user, persist) => ({
    type: types.SET_STATUS,
    payload: {
        user,
        persist
    }
})


export const removeUserStatus = (userId) => ({
    type: types.REMOVE_STATUS,
    payload: {
        userId,
    }
})
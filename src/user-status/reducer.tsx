import * as types from './action-types'

const initialState = {
};

function handleSetUserStatus(state, {user: {id, userId, location, avatar, displayName}}) {
    return {
        ...state,
        [userId]: {userId, location, avatar, displayName},
    }
}

function handleRemoveUserStatus(state, { id }) {
    return Object.keys(state).reduce((acc, userId) => {
        if (userId !== id) {
            acc[userId] = state[userId]
        }
        return acc
    }, {})
}


function userStatusReducer(state = initialState, action) {
    switch (action.type) {
        case (types.SET_STATUS): {
            return handleSetUserStatus(state, action.payload)
        }
        case (types.REMOVE_STATUS): {
            return handleRemoveUserStatus(state, action.payload)
        }
        default: {
            return state;
        }
    }
}

  export default userStatusReducer
import * as types from './action-types'
import snakeCase from 'lodash/snakeCase'

const initialState = {
};

function handleSetNote(state, {id, label, content}) {
    return {
        ...state,
        [snakeCase(label)]: {id, content},
    }
}


function notesReducer(state = initialState, action) {
    switch (action.type) {
        case (types.SET_NOTE): {
            return handleSetNote(state, action.payload)
        }
        default: {
            return state;
        }
    }
}

  export default notesReducer
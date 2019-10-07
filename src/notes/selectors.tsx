import {createSelector} from 'reselect'
import snakeCase from 'lodash/snakeCase'

export const getState = state => state.notes

export const getLabels = createSelector([getState], state => Object.keys(state).sort())

export const getPaths = createSelector([getLabels], labels => {
    const specificPaths = {'home': '/'}
    const specificLabels = Object.keys(specificPaths)
    return labels.map(label => {
        if (specificLabels.includes(label)) {
            return {label: label, path: specificPaths[label]}
        }
        return {label: label, path: `/p/${label}/`}
    })
})

export const makeGetNoteByLabel = label => {
    return createSelector([getState], (state) => state[snakeCase(label)])
}
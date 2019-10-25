/**
 * Combine all reducers in this file and export the combined reducers.
 */

import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from '../utils/history';
import auth from '../auth/reducer'
import notes from '../notes/reducer'
import userStatus from '../user-status/reducer'

/**
 * Merges the main reducer with the router state and dynamically injected reducers
 */
export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    router: connectRouter(history),
    auth,
    notes,
    userStatus,
    ...injectedReducers,
  });

  return rootReducer;
}
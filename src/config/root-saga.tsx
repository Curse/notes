import {spawn, call, all} from 'redux-saga/effects'
import notesSaga from '../notes/saga'
import userStatusSaga from '../user-status/saga'

export default function* rootSaga () {
    const sagas = [
        notesSaga,
        userStatusSaga,
    ];
  
    yield all(sagas.map(saga =>
      spawn(function* () {
        while (true) {
          try {
            yield call(saga)
            break
          } catch (e) {
            console.log(e)
          }
        }
      }))
    );
  }
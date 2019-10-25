import {eventChannel} from 'redux-saga'
import {take, put, call, select, takeEvery, fork, cancel} from 'redux-saga/effects'
import firebase from 'firebase'
import * as authSelectors from '../auth/selectors'
import * as notesTypes from './action-types'
import * as authTypes from '../auth/action-types'
import * as actions from './actions'

const types = [...Object.values(notesTypes), authTypes.SET_USER]

function* createFirebaseChannel(user) {
    const database = firebase.firestore()

    return eventChannel(emiter => {
        const listener = database.collection("notes").onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => emiter({id: change.doc.id, data: change.doc.data()}))
        })
  
        return () => {
          //@ts-ignore
          listener.off();
        }
    })
}

function* listenForNotes() {
    const user = yield select(authSelectors.getUser)
    if (!user) {
        return
    }
    const firebaseChannel = yield call(createFirebaseChannel, user) 

    while (true) {
        try {
            const { id, data } = yield take(firebaseChannel);
            yield put(actions.setNote({id, ...data, persist: false}));
        } catch(err) {
            console.log('firebase error', err)
        }
    }
}

function* persistNote({id, label, content}) {
    const user = yield select(authSelectors.getUser)
    if (!user) {
        return
    }
    const database = firebase.firestore()
    if (!id) {
        yield database.collection("notes").add({
            owner: user.uid,
            label,
            content,
        })
    } else {
        database.collection('notes').doc(id).get().then(docSnapshot => {
            docSnapshot.ref.update({label, content})
        })
    }
    
}

function* sagaFilter({type, payload}) {
    switch (type) {
        case authTypes.SET_USER:
            const currentSync = yield fork(listenForNotes)
            yield take(notesTypes.STOP_SYNC)
            yield cancel(currentSync)
            break
        case notesTypes.SET_NOTE:
            if (payload.persist) {
                yield call(persistNote, payload)
            }
            break
    }
  }
  

export default function* notesSaga() {
    yield takeEvery(types, sagaFilter)
}
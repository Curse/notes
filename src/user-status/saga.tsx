import {eventChannel} from 'redux-saga'
import {take, put, call, select, takeEvery, fork, cancel} from 'redux-saga/effects'
import firebase from 'firebase'
import * as authSelectors from '../auth/selectors'
import * as userStatusTypes from './action-types'
import * as authTypes from '../auth/action-types'
import * as actions from './actions'
import {LOCATION_CHANGE, getLocation} from 'connected-react-router'
const types = [...Object.values(userStatusTypes), authTypes.SET_USER, LOCATION_CHANGE]

function* createFirebaseChannel(user) {
    const database = firebase.firestore()

    return eventChannel(emiter => {
        const listener = database.collection("user-status").where('status', '==', 'active').onSnapshot(snapshot => {
          snapshot.docChanges().forEach(change => {
              emiter({id: change.doc.id, data: change.doc.data(), action: change.type})
          })
        })

        return () => {
          //@ts-ignore
          listener.off();
        }
    })
}

function* listenForStatusChanges() {
    const user = yield select(authSelectors.getUser)
    if (!user) {
        return
    }
    const firebaseChannel = yield call(createFirebaseChannel, user)

    while (true) {
        try {
            const { id, data, action } = yield take(firebaseChannel);
            switch (action) {
                case 'remove':
                    yield put(actions.removeUserStatus(id));
                default:
                    if (data.userId !== user.uid) {
                        yield put(actions.setUserStatus({id, ...data},false));
                    }
            }
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

function* persistOwnStatus() {
    const user = yield select(authSelectors.getUser)
    const location = yield select(getLocation)
    const database = firebase.firestore()
    if (!user) {
        return
    }
    const existingSnapshot = yield database.collection("user-status")
        .where('userId', '==', user.uid).get()

    let existingId = null
    existingSnapshot.forEach((doc) => existingId=doc.id)

    if (!existingId) {
        yield database.collection("user-status").add({
            userId: user.uid,
            avatar: user.photoURL,
            displayName: user.displayName,
            status: 'active',
            location: location.pathname,
        })
    } else {
        database.collection('user-status').doc(existingId).get().then(docSnapshot => {
            docSnapshot.ref.update({status: 'active', location: location.pathname})
        })
    }
}

function* sagaFilter({type, payload}) {
    switch (type) {
        case authTypes.SET_USER:
            const currentSync = yield fork(listenForStatusChanges)
            break
        case LOCATION_CHANGE:
            yield fork(persistOwnStatus)
            break
    }
}


export default function* userStatusSaga() {
    yield takeEvery(types, sagaFilter)
}
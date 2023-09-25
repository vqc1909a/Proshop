import { /* call, put, takeEvery, */ all} from 'redux-saga/effects'

export function* helloSaga(){
    yield console.log("Hello Sagas!");
}

export default function* rootSaga(){
    yield all ([
        helloSaga()
    ])
}

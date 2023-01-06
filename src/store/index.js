// index.js (STORE)
import { createStore } from 'redux'
import CountReducer from './reducers/order.reducer'

export default createStore(CountReducer)

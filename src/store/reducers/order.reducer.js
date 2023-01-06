// count.reducer.js
import { ADD_DISH, RESET } from '../actions/order.actions'

const CountReducer = (state = { dishes: [], total_dishes: 0 }, action) => {
    switch (action.type) {
      case ADD_DISH: return { dishes: state.dishes.concat(action.payload), total_dishes: state.total_dishes + 1 }
      case RESET: return { dishes: [], total_dishes: 0 }
      default: return state
    }
}

export default CountReducer

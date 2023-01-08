// count.reducer.js
import { ADD_DISH, RESET } from '../actions/order.actions'

const CountReducer = (state = { dishes: [], total_dishes: 0 }, action) => {
    switch (action.type) {
      case ADD_DISH:
        console.log("I", action.payload)
        const index = state.dishes.findIndex((dish) => dish.uuid == action.payload.uuid);
        if(index === -1){
          Object.assign(action.payload, {qty: Number(1)})
          return { 
            dishes: state.dishes.concat(action.payload), 
            total_dishes: state.total_dishes + 1 
          }  
        }

        Object.assign(action.payload, {qty: state.dishes[index].qty+Number(1)})
        state.dishes[index] = action.payload;

        return state;

      case RESET:
        return { 
          dishes: [], 
          total_dishes: 0 
        }
      default:
        return state
    }
}

export default CountReducer;

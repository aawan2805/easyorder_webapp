// count.reducer.js
import { ADD_DISH, RESET, SUBSTITUTE_DISH } from '../actions/order.actions'
import { v4 as uuidv4 } from 'uuid';

const CountReducer = (state = { dishes: [], total_dishes: 0 }, action) => {
    switch (action.type) {
      case ADD_DISH:
        console.log("ADD_DISH")
        const addExcludeIngredients = {
          ...action.payload,
          ingredients: action.payload.ingredients.map(ing => ({
            name: ing,
            exclude: false
          })),
          randomUuid: uuidv4(),
        }

        return {
          dishes: state.dishes.concat(addExcludeIngredients),
          total_dishes: state.total_dishes + 1
        }
        //
        // const index = state.dishes.findIndex((dish) => dish.uuid == action.payload.uuid);
        // if(index === -1){
        //   Object.assign(action.payload, {qty: Number(1), key: action.payload.uuid})
        //   return {
        //     dishes: state.dishes.concat(action.payload),
        //     total_dishes: state.total_dishes + 1
        //   }
        // }
        //
        // Object.assign(action.payload, {qty: state.dishes[index].qty+Number(1)})
        // state.dishes[index] = action.payload;
        //
        // return state;

      case SUBSTITUTE_DISH:
        return {
          dishes: action.payload,
          total_dishes: state.total_dishes
        }

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

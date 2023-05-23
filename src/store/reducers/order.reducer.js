// count.reducer.js
import { ADD_DISH, RESET, SUBSTITUTE_DISH, REMOVE_DISH, INCREMENT_QUANTITY, DECREMENT_QUANTITY } from '../actions/order.actions'
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
          key: uuidv4(),
          quantity: 1,
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

      case INCREMENT_QUANTITY:
        const index = state.dishes.findIndex((dish) => dish.uuid === action.payload.uuid);

        if(index !== -1) {
          const newDishes = state.dishes.map(obj => {
            if(obj.randomUuid === action.payload.randomUuid) {
              return {...obj, quantity: obj.quantity + 1}
            } else {
              return {...obj}
            }
          })
          return {
            ...state,
            dishes: newDishes
          }
        } else {
          return state;
        }

      case DECREMENT_QUANTITY:
        const newDishes = state.dishes.map(obj => {
          if(obj.randomUuid === action.payload.randomUuid && obj.quantity >= 1) {
            return {...obj, quantity: obj.quantity - 1}
          } else {
            return {...obj}
          }
        })
        return {
          ...state,
          dishes: newDishes
        }

      case REMOVE_DISH:
        return {
          ...state,
          total_dishes: state.total_dishes - 1,
          dishes: state.dishes.filter(item => item.randomUuid !== action.payload.randomUuid),
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

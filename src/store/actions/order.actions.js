export const ADD_DISH = 'ADD_DISH'
export const addOne = (item) => ({ type: ADD_DISH, payload: item })

export const RESET = 'RESET'
export const reset = () => ({ type: RESET })

export const SUBSTITUTE_DISH = 'SUBSTITUTE_DISH'
export const substituteDish = (item) => ({ type: SUBSTITUTE_DISH, payload: item })

export const REMOVE_DISH = 'REMOVE_DISH'
export const deleteFromCart = (item) => ({ type: REMOVE_DISH, payload: item })

export const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY'
export const incrementQuantity = (item) => ({ type: INCREMENT_QUANTITY, payload: item })

export const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY'
export const decrementQuantity = (item) => ({ type: DECREMENT_QUANTITY, payload: item })

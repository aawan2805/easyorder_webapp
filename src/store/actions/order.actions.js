export const ADD_DISH = 'ADD_DISH'
export const addOne = (item) => ({ type: ADD_DISH, payload: item })

export const RESET = 'RESET'
export const reset = () => ({ type: RESET })

export const SUBSTITUTE_DISH = 'SUBSTITUTE_DISH'
export const substituteDish = (item) => ({ type: SUBSTITUTE_DISH, payload: item })

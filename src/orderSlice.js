import { createSlice } from '@reduxjs/toolkit';
const orderSlice = createSlice({
    name: "location",
    initialState: {
        dishes: [],
    },
    reducers: {
        save: (state, param) => {
            const { item } = param.payload;
            console.log(item)
            state.dishes.concat(item)
        },
    }
});
const { actions, reducer } = orderSlice
export const { save } = actions;
export default reducer;

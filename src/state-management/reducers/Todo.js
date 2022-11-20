import { SET_TODOS } from "../constants/Todo";

export const todoReducer = (state, action) => {
    switch (action.type) {
        case SET_TODOS:
            return {...state, todos: action.todos}
        
        default:
            return state
    }
}

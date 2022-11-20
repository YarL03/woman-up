import { useEffect, useReducer } from 'react'
import { SET_TODOS } from '../../../state-management/constants/Todo'
import { todoReducer } from '../../../state-management/reducers/Todo'
import Header from './Header/Header'
import styles from './Todo.module.less'
import TodoItem from './TodoItem/TodoItem'
import { getDatabase, ref, onValue} from "firebase/database";

const initialState = {
    todos: null
}

/**
 * Инициализируем стейт через useReducer,
 * в useEffect при монтировании вешаем слушателя на БД
 * и сетаем данные в стейт
 * 
 * Рендерим полученные todos
 * 
 * @component
 */
const Todo = () => {
    const [state, dispatch] = useReducer(todoReducer, initialState)

    useEffect(() => {
        const db = getDatabase();
        const todosRef = ref(db, 'todos');

        onValue(todosRef, (snapshot) => {
            const data = snapshot.val();
            
            data && dispatch({
                type: SET_TODOS,
                todos: Object.entries(data).map(item => item[1])
            });

            data === null && dispatch({
                type: SET_TODOS,
                todos: []
            })
        });
    }, [])

    return (
        <div className={styles.wrapper}>
            <Header dispatch={dispatch}/>
            <div>
                <div className={styles.todos}>
                {state.todos === null
                ? <span>Loading...</span>
                : state.todos.map(item =>
                    <TodoItem key={item.id} todo={item}/>)}
                </div>
            </div>
            
        </div>
    )
}

export default Todo
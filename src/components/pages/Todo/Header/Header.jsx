import styles from './Header.module.less'
import HeaderForm from './HeaderForm'

/**
 * Шапка с формой для добавления todo в БД
 * 
 * @component
 */
const Header = () => {
    
    return (
        <div className={styles['todo-header']}>
            <h1>Add todo</h1>
            <HeaderForm />
        </div>
    )
}

export default Header
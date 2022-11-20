import styles from './Field.module.less'

/**
 * Любой заданный input
 * 
 */
const Field = ({type = 'text', ...props}) => {

    return (
        <input className={styles.field}
        type={type}
        {...props}
        />
    )
}

export default Field
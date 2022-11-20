import styles from './Layout.module.less'

/**
 * @component
 * @param children
 * @description обертка над компонентами
 */
const Layout = ({children}) => {

    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    )
}

export default Layout
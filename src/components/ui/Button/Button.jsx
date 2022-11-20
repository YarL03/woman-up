import styles from './Button.module.less'

/**
 * Кнопка
 * 
 * @component
 * @param {{text: string, secondary: boolean, type: string}}
 * 
 * @description text - содержимое кнопки, secondary - применение дополнительных стилей, type - htmlType 
 */
const Button = ({text, secondary = false, type = 'button'}) => {
    return (
        <button type={type} className={`${styles.button} ${secondary ? styles.secondary : ''}`}>
            {text}
        </button>
    )
}

export default Button
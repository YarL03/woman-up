import { useState } from 'react'
import Button from '../../../ui/Button/Button'
import Field from '../../../ui/Field/Field'
import styles from './Header.module.less'
import { getDatabase, ref, set } from "firebase/database";

/**
 * Форма для добавления todo в БД с управляемыми input'ами
 * 
 * @component
 */
const HeaderForm = () => {
    const [heading, setHeading] = useState('')
    const [descrip, setDescrip] = useState('')
    const [date, setDate] = useState('')

    /**
     * Отправка данных с управляемых input'ов в БД
     * и сброс значений после отправки
     * 
     * @param {*} e событие
     */
    const onSubmit = (e) => {
        e.preventDefault()
        
        const db = getDatabase();
        const id = Date.now()

        set(ref(db, 'todos/' + id), {
            heading,
            descrip,
            date,
            id,
            files: 0,
            complete: false
        });

        setHeading('')
        setDescrip('')
        setDate('')

}

    return (
        <form onSubmit={onSubmit} className={styles.headerForm}>
            <Field
                onChange={(e) => setHeading(e.target.value)}
                value={heading}
                name="heading"
                placeholder="Heading"
                required
                />
            <Field
                onChange={(e) => setDescrip(e.target.value)}
                value={descrip}
                name="description"
                placeholder="Description"
                required
                />
            <label className={styles.date}>
                <Field
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                    name="date"
                    type="datetime-local"
                    required
                    />
            </label>
            <div>
                <Button type="submit" text="Add"/>
            </div>
        </form>
    )
}

export default HeaderForm
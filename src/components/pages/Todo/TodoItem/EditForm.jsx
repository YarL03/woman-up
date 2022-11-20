import { useRef, useState } from "react"
import Button from "../../../ui/Button/Button"
import Field from "../../../ui/Field/Field"
import { getDatabase, ref as refDb, set } from "firebase/database";
import { getStorage, ref as refStorage, uploadBytes, deleteObject } from "firebase/storage";
import styles from './TodoItem.module.less'

/**
 * Форма для редактирования todo
 * 
 * @component
 * @param links - массив для рендера ссылок
 * @param close - меняет edit --> false
 * @param todo - конкретный todo
 * @param setUploading 
 */
const EditForm = ({links, close, todo, setUploading}) => {
    const [heading, setHeading] = useState(todo.heading)
    const [descrip, setDescrip] = useState(todo.descrip)
    const [date, setDate] = useState(todo.date)
    const ref = useRef(null)

    /**
     * Записывает сделанные изменения в БД и закрывает данный компонент 
     * 
     * @param e - submitEvent
     */
    const onSubmit = (e) => {
        e.preventDefault()

        const db = getDatabase()
        const uploadedFiles = ref.current[3].files.length ? ref.current[3].files : null // количество загруженных файлов

        set(refDb(db, `todos/${todo.id}`), {
            ...todo,
            heading,
            descrip,
            date,
            files: todo.files ?  todo.files : uploadedFiles ? uploadedFiles.length : 0
        })

        if (uploadedFiles) {
            const storage = getStorage()

            const promises = Object.entries(uploadedFiles).reduce((prev, cur) => {
                cur[0] !== 'length' && prev.push(uploadBytes(refStorage(storage, `${todo.id}/${cur[1].name}`), cur[1]))
                return prev
            }, [])

            setUploading(true)

            Promise.allSettled(promises)
            .then((results) => {
                setUploading(false)
            })
        }
        close()
    }

    /**
     * Удаляет файл из хранилища
     * 
     * @param {{url: string, name: string, storageRef: {}}} blobRef объект с 3 свойствами: url - ссылка для <a>, name - имя скачиваемого файла, storageRef - ссылка на место файла в хранилище
     */
    const onDeleteFile = (blobRef) => () => {

        deleteObject(blobRef.storageRef)
        .then(() => {
            const db = getDatabase()

            set(refDb(db, `todos/${todo.id}`), {
                ...todo,
                files: todo.files - 1
            })
        })
    }

    /**
     * Закрывает данный компонент
     */
    const onDoubleClick = () => close()

    return (
        <form ref={ref} onSubmit={onSubmit} onDoubleClick={onDoubleClick}>
            <div>
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
                <Field
                    onChange={(e) => setDate(e.target.value)}
                    value={date}
                    name="date"
                    type="datetime-local"
                    required
                    />
            </div>
            <Field
                name="files"
                type="file"
                multiple
                accept="image/*,.png,.jpg,.git,.web,.txt,.pdf,.doc,.docx"
            />
            
            <div className={styles.files}>
                {links.map(blobRef => 
                    (<div key={blobRef.url} className={styles.download}>
                        <svg onClick={onDeleteFile(blobRef)} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="CloseIcon" aria-label="fontSize small"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>
                        <a  download={blobRef.name} href={blobRef.url}>
                            {blobRef.name}
                        </a>
                    </div>)
                )}
            </div>
            <div>
                <Button type="submit" text="Edit" secondary/>
            </div>
        </form>
    )
}

export default EditForm
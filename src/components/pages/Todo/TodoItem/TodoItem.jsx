import styles from './TodoItem.module.less'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { getDatabase, ref, update, remove } from "firebase/database";
import { getStorage, ref as refStorage, deleteObject, listAll, getBlob } from "firebase/storage";
import EditForm from './EditForm';

/**
 * Принимает конкретный todo, при монтировании в одном useEffect проверяет, не истекло ли установленное для задачи время,
 * 
 * Во втором useEffect получает файлы из хранилища, если они там есть
 * 
 * Дальше условный рендер полей todo или формы для их редактирования
 * 
 * @description loading - получение файлов из хранилища, uploading - загрузка файлов в хранилище 
 * 
 * @component
 * @param {{heading: string, descrip: string, date: string, complete: false, files: number, id: number}} todo
 */
const TodoItem = ({todo}) => {
    const [edit, setEdit] = useState(false)
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [fileLinks, setFileLinks] = useState([])

    
    useEffect(() => {

        if (todo.files) {
            const storage = getStorage()
            let items

            setLoading(true)

            listAll(refStorage(storage))
            .then(res => {
                res.prefixes.forEach(item => {
                    item.name === `${todo.id}` && listAll(item)
                        .then(res => {
                            items = res.items
                            Promise.allSettled(res.items.map(fileRef => {
                                return getBlob(fileRef)
                            }))
                            .then(res => {
                                setFileLinks(res.map((resProm, index) => 
                                    ({
                                        url: URL.createObjectURL(resProm.value),
                                        name: items[index].name,
                                        storageRef: items[index]
                                    })
                                ))
                                setLoading(false)
                            })
                            
                        })
                })
            })
        }
    }, [todo.files, uploading])

    useEffect(() => {
        if (dayjs().isAfter(dayjs(todo.date))) {
            const db = getDatabase()

            const updates = {}
            updates[`/todos/${todo.id}`] = {...todo, complete: true}
            
            update(ref(db), updates)
        }
    }, [])

    /**
     * Обработчик onClick для смены статуса todo
     * @description set complete --> true
     */
    const onComplete = () => {
        const db = getDatabase()

        const updates = {}
        updates[`/todos/${todo.id}`] = {...todo, complete: true}
            
        update(ref(db), updates)
    }

    /**
     * Обработчик onClick для удаления todo из БД
     */
    const onDelete = () => {
        const db = getDatabase()

        remove(ref(db, `todos/${todo.id}`))

        if (todo.files) {
            const storage = getStorage()

            listAll(refStorage(storage))
            .then(res => {
                res.prefixes.forEach(item => {
                    item.name === `${todo.id}` && listAll(item)
                        .then(res => {
                            res.items.forEach(item => {
                                deleteObject(item)
                            })
                        })
                })
            })
        }
    }

    /**
     * Обработчик onClick для открытия формы редактирования todo 
     */
    const onEdit = () => {
        if (todo.complete || loading || uploading) 
            return

        setEdit(true)
     }

    return (
        <div data-complete={todo.complete} data-edit={edit} className={styles.todoItem}>
            { edit && !todo.complete
             ? <EditForm links={fileLinks} setUploading={setUploading} close={() => setEdit(false)} todo={todo}/>
             : <>
                <div onDoubleClick={onEdit}>
                   {loading || uploading ? <h1>Loading...</h1> : <>
                   <div className={styles.heading}>
                        {todo.heading}
                    </div>
                    <div className={styles.descrip}>
                        {todo.descrip}
                    </div>
                    <div className={styles.date}>
                        {dayjs(todo.date).format('YYYY.MM.DD HH:mm')}
                    </div>
                    <div className={styles.files}>
                        {fileLinks.map(blobRef => 
                            (<a key={blobRef.url} download={blobRef.name} href={blobRef.url}>
                                {blobRef.name}
                            </a>))}
                    </div>
                    </>}
                </div>
                <div>
                    <span onClick={onDelete} className={styles.delete}>Delete</span>
                    {!todo.complete && <span onClick={onComplete} className={styles.complete}>Complete</span>}
                </div>
                {!loading && todo.complete && <h1>Completed</h1>}
            </>
            
            

        }
        </div>
    )
}

export default TodoItem
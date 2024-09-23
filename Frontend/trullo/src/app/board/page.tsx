import styles from "./styles/Board.module.css"
import Link from "next/link"

export default function Board() {

    return (
        <div className={styles.board}>

            <Link href="/new-task"><button className={styles["create-task-btn"]}>Create task</button></Link>

            <div className={styles.boardpart}>
                <p>To-do</p>
            </div>

            <div className={styles.boardpart}>
                <p>In progress</p>
            </div>

            <div className={styles.boardpart}>
                <p>Blocked</p>
            </div>

            <div className={styles.boardpart}>
                <p>Done</p>
            </div>
        </div>
    )
}
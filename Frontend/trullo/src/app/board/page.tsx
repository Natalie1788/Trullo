import styles from "./styles/Board.module.css"
import Link from "next/link"
import TasksByStatusInProgress from "./components/InprogressTasks"
import TasksByStatusToDo from "./components/ToDoTasks"

export default function Board() {

    return (
        <div className={styles.board}>

            <Link href="/new-task"><button className={styles["create-task-btn"]}>Create task</button></Link>

            <div className={styles.boardpart}>
                <p className={styles.headtext}>To-do</p>
            <TasksByStatusToDo/>
            </div>

            <div className={styles.boardpart}>
                <p className={styles.headtext}>In progress</p>
                <TasksByStatusInProgress/>
            </div>

            <div className={styles.boardpart}>
                <p className={styles.headtext}>Blocked</p>
            </div>

            <div className={styles.boardpart}>
                <p className={styles.headtext}>Done</p>
            </div>
        </div>
    )
}
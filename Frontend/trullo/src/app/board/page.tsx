import styles from "./styles/Board.module.css"

export default function Board() {

    return (
        <div className={styles.board}>
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
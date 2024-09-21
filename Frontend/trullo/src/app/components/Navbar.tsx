import Link from "next/link"
import styles from "../styles/Navbar.module.css"

export default function Navbar() {

    return (
        <nav className={styles.navbar}>
            <Link style={{textDecoration: "none", color: "white"}} href="/">Home</Link>
            <Link style={{textDecoration: "none", color: "white"}} href="/board">Board</Link>
            <Link style={{textDecoration: "none", color: "white"}} href="/members">Members</Link>
            <Link style={{textDecoration: "none", color: "white"}} href="/account">My account</Link>
        </nav>
    )
}
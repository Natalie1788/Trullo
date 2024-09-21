import Logo from "./components/Logo";
import styles from "./styles/Home.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <Logo/>
  <h1>Welcome to Trullo!</h1>
  </div>
  );
}

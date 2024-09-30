"use client"

import Logo from "./components/Logo";
import styles from "./styles/Home.module.css"
import { ApolloProvider } from '@apollo/client';
import { UserProvider } from "./context/userContext";
import Link from "next/link";

import client from "./ApolloClient";

export default function Home() {
  return (
    <ApolloProvider client={client}>
      <UserProvider>
      <div className={styles.container}>
    <div className={styles.logocontainer}>
      <Logo/>
  <h1>Welcome to Trullo!</h1>
  </div>


  <h2 className={styles.maintext}>Here you can collaborate in the best and more convenient way with others and to plan your own task more thoroughly</h2>
  <Link href="/register"><button className={styles["start-btn"]}>Begin planning</button></Link>
  
  
  </div>
  </UserProvider>
  </ApolloProvider>
  );
}

"use client"

import LoginForm from "./components/loginUserForm";
//import { ApolloProvider } from "@apollo/client";
//import { UserProvider } from "../context/userContext";
//import client from "../ApolloClient";
import styles from "./Loginpage.module.css"

export default function registerUser() {


    return(
       
          <div className={styles.container}>
           <LoginForm />
           </div>
       
        
    )
}
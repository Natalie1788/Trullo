"use client"

import LoginForm from "../components/loginUserForm";
import { ApolloProvider } from "@apollo/client";
import client from "../ApolloClient";
import styles from "./Loginpage.module.css"

export default function registerUser() {


    return(
        <ApolloProvider client={client}>
          <div className={styles.container}>
           <LoginForm />
           </div>
        </ApolloProvider>
        
    )
}
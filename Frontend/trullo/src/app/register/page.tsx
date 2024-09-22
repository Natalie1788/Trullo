"use client"

import RegisterForm from "../components/registerUserForm";
import { ApolloProvider } from "@apollo/client";
import client from "../ApolloClient";
import styles from "./Registerpage.module.css"

export default function registerUser() {


    return(
        <ApolloProvider client={client}>
          <div className={styles.container}>
           <RegisterForm />
           </div>
        </ApolloProvider>
        
    )
}
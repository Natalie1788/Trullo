"use client"

import RegisterForm from "./components/registerUserForm";
import styles from "./Registerpage.module.css"

export default function registerUser() {


    return(
     
          <div className={styles.container}>
           <RegisterForm />
           </div>
   
        
    )
}
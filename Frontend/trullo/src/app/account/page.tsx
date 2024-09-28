"use client"

import UserProfile from "./components/UserPage";
//import { UserProvider } from "../context/userContext";
//import { ApolloProvider } from "@apollo/client";
import client from "../ApolloClient";

export default function getUserProfile() {

    return (
      <div>
            <h1>Hello</h1>
            <UserProfile />
            </div>
    )
}
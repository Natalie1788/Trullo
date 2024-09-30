"use client"

import UserProfile from "./components/UserProfile";
import LogoutButton from "./components/LogoutButton";

export default function getUserProfile() {

    return (
      <div>
            
            <UserProfile />
            <LogoutButton />
            </div>
    )
}
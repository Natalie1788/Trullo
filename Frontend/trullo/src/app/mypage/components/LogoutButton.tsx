"use client";

import { useMutation } from "@apollo/client";
import { LOGOUT_USER } from "@/app/mutations/userMutations";
import { useUser } from "../../context/userContext";
import { useRouter } from "next/navigation";

interface LogoutUserData {
    logOut: boolean;
}

const LogoutButton = () => {
    const { setUser } = useUser();
    const [logOut, { loading: logoutLoading, error: logoutError }] = useMutation<LogoutUserData>(LOGOUT_USER);
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await logOut();
            setUser(null);
            localStorage.removeItem("token");
            console.log("Token removed, user logged out");
            router.push("/");
        } catch (err: any) {
            console.error("Logout error:", err.message);
            alert("Logout failed. Please try again.");
        }
    };

    return (
        <div>
            {logoutError && <p>Error: {logoutError.message}</p>}
            <button onClick={handleLogout} disabled={logoutLoading}>
                {logoutLoading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
};

export default LogoutButton;

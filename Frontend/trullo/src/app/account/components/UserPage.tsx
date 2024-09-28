"use client";

import { useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../../queries/userQueries";
import { LOGOUT_USER } from "@/app/mutations/userMutations";
import { useUser } from "../../context/userContext";
import { useRouter } from "next/navigation";

export interface Task {
    id: string;
    title: string;
    description: string;
}

interface LogoutUserData {
    logOut: boolean;
}

const UserProfile = () => {
    const { user, setUser } = useUser();
    const [logOut, { loading: logoutLoading, error: logoutError }] = useMutation<LogoutUserData>(LOGOUT_USER);
    const router = useRouter();

    // Извлечение токена из локального хранилища
    const token = localStorage.getItem('token');

    // Запрос на получение текущего пользователя
    const { loading, error, data } = useQuery(GET_CURRENT_USER, {
        context: {
            headers: {
                Authorization: token ? `Bearer ${token}` : '', // Добавляем токен в заголовки запроса
            },
        },
    });

    useEffect(() => {
        if (!user && !loading) {
          router.push("/login"); 
        }
      }, [user, loading, router]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    // Обновление состояния пользователя, если данные успешно получены
    useEffect(() => {
        if (data?.currentUser) {
            setUser(data.currentUser);
        }
    }, [data, setUser]);

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
            {data?.currentUser && (
                <>
                    <h1>Welcome, {data.currentUser.username}!</h1>

                    <h2>My Tasks</h2>
                    <ul>
                        {data.currentUser.tasks && data.currentUser.tasks.length > 0 ? (
                            data.currentUser.tasks.map((task: Task) => (
                                <li key={task.id}>
                                    <h3>{task.title}</h3>
                                    <p>{task.description}</p>
                                </li>
                            ))
                        ) : (
                            <p>No tasks found.</p>
                        )}
                    </ul>
                </>
            )}

            {logoutError && <p>Error: {logoutError.message}</p>}
            <button onClick={handleLogout} disabled={logoutLoading}>
                {logoutLoading ? "Logging out..." : "Logout"}
            </button>
        </div>
    );
};

export default UserProfile;

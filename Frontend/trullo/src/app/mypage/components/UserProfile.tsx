"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_CURRENT_USER } from "../../queries/userQueries";
import { useUser } from "../../context/userContext";
import { useRouter } from "next/navigation";

export interface Task {
    id: string;
    title: string;
    description: string;
}

const UserDetails = () => {
    const { user, setUser } = useUser();
    const router = useRouter();

    // Extract token from localStorage
    const token = localStorage.getItem('token');

    // Fetch the current user
    const { loading, error, data } = useQuery(GET_CURRENT_USER, {
        context: {
            headers: {
                Authorization: token ? `Bearer ${token}` : '', // Include token in headers
            },
        },
    });

    useEffect(() => {
        if (!user && !loading) {
          router.push("/login"); 
        }
      }, [user, loading, router]);

    // Update user state when data is received
    useEffect(() => {
        if (data?.currentUser) {
            setUser(data.currentUser);
        }
    }, [data, setUser]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

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
        </div>
    );
};

export default UserDetails;

"use client";

import { GET_USERS } from "../queries/userQueries";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

// Интерфейсы для типизации пользователей и задач
interface Task {
  id: string;
  title: string;
}

interface User {
  id: string;
  username: string;
  tasks: Task[];
}

// Интерфейс для данных, возвращаемых из запроса
interface GetUsersData {
  users: User[];
}

const UserList = () => {
  // Добавляем типизацию для useQuery с использованием GetUsersData
  const { loading, error, data } = useQuery<GetUsersData>(GET_USERS);

  useEffect(() => {
    if (loading) {
      console.log('Loading users...');
    }
    if (error) {
      console.error(error);
    }
    if (data) {
      console.log('Fetched users:', data.users);
    }
  }, [data, loading, error]);

  const showUsers = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (!data || !data.users || data.users.length === 0) {
      return <p>No users found.</p>;
    }

    return (
      <ul>
        {data.users.map(user => (
          <li key={user.id}>
            {user.username}
            {user.tasks && user.tasks.length > 0 ? (
              <>
                <p><strong>Tasks:</strong></p>
                <ul>
                  {user.tasks.map((task) => {
                    console.log('Task title:', task.title);
                    return task.title && task.title.trim() ? (
                      <li key={task.id}>{task.title}</li>
                    ) : (
                      <li key={task.id}><em>No tasks</em></li>
                    );
                  })}
                </ul>
              </>
            ) : (
              <p>No tasks available</p>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return <div>{showUsers()}</div>;
};

export default UserList;

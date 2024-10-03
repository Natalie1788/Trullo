"use client";

import { useQuery } from "@apollo/client";
import { GET_TASKS_BY_STATUS } from "@/app/queries/taskQueries";
import styles from "../styles/Tasks.module.css";

// Интерфейсы для задач
interface TaskByStatus {
  id: string;
  title: string;
  taskStatus: string;
  assignedTo: {
    username: string;
  };
}

interface GetTasksByStatusData {
  tasksByStatus: TaskByStatus[];
}

const TasksByStatusDone = () => {
  const { loading, error, data } = useQuery<GetTasksByStatusData>(GET_TASKS_BY_STATUS, {
    variables: { taskStatus: "done" },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      {data && data.tasksByStatus.length > 0 ? (
        data.tasksByStatus.map((task) => (
            <ul className={styles["tasks-list"]}>
          <li className={styles["task-item"]} key={task.id}>
            <h3>{task.title}</h3>
            {task.assignedTo && task.assignedTo.username ? (
              <p className={styles["assign-text"]}>Completed by: {task.assignedTo.username}</p>
            ) : (
              <p>No user completed this task</p>
            )}
          </li>
          </ul>
        ))
      ) : (
        <p className={styles["assign-text"]}>No tasks found.</p>
      )}
    </div>
  );
};

export default TasksByStatusDone;

"use client";

import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_TASKS_BY_STATUS } from "@/app/queries/taskQueries";
import { UPDATE_TASK, DELETE_TASK } from "@/app/mutations/taskMutations";
import styles from "../styles/Tasks.module.css";

// Интерфейсы для данных о задачах
interface TaskByStatus {
  id: string;
  title: string;
  description: string;
  taskStatus: string;
  assignedTo: {
    username: string;
  };
}

interface GetTasksByStatusData {
  tasksByStatus: TaskByStatus[];
}

const TasksByStatusInProgress = () => {
  const { loading, error, data, refetch } = useQuery<GetTasksByStatusData>(GET_TASKS_BY_STATUS, {
    variables: { taskStatus: "in progress" },
  });

  // Мутации для редактирования и удаления задач
  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);

  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [taskDescription, setTaskDescription] = useState<string>("");

  useEffect(() => {
    if (loading) {
      console.log("loading tasks");
    }
    if (error) {
      console.error("Error fetching tasks", error);
    }
    if (data) {
      console.log("Fetched tasks", data.tasksByStatus);
    }
  }, [data, loading, error]);

  // Функция для показа списка задач
  const showTasksByStatus = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (!data || !data.tasksByStatus || data.tasksByStatus.length === 0) {
      return <p>No tasks found.</p>;
    }

    return (
      <ul className={styles["tasks-list"]}>
        {data.tasksByStatus.map((task) => (
          <li className={styles["task-item"]} key={task.id}>
            {editingTask === task.id ? (
              <div>
                <input
                  type="text"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                />
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                />
                <button onClick={() => handleUpdateTask(task.id)}>Save</button>
                <button onClick={() => setEditingTask(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{task.title}</p>
                <p className={styles["assign-text"]}>
                  {task.assignedTo && task.assignedTo.username
                    ? task.assignedTo.username
                    : "Unassigned"}
                </p>
                <button onClick={() => setEditingTask(task.id)}>Edit</button>
                <button style={{marginLeft: "10px"}} onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  // Функция для обновления задачи
  const handleUpdateTask = async (id: string) => {
    try {
      await updateTask({
        variables: { id, title: taskTitle, description: taskDescription },
      });
      setEditingTask(null);
      refetch(); // Перезапрос данных после обновления
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  // Функция для удаления задачи
  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask({ variables: { id } });
      refetch(); // Перезапрос данных после удаления
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return <div>{showTasksByStatus()}</div>;
};

export default TasksByStatusInProgress;

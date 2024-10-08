"use client"

import { useQuery, useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { GET_USERS } from "@/app/queries/userQueries";
import { GET_TASKS_BY_STATUS } from "@/app/queries/taskQueries";
import { UPDATE_TASK, DELETE_TASK, ASSIGN_TASK, UNASSIGN_TASK, UPDATE_TASK_STATUS } from "@/app/mutations/taskMutations";
import styles from "../styles/Tasks.module.css";

// Интерфейсы
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

interface User {
  id: string;
  username: string;
}

interface GetUsersData {
  users: User[];
}

interface TasksByStatusProps {
  status: string;
}

const TasksByStatus: React.FC<TasksByStatusProps> = ({ status }) => {
  const { loading, error, data, refetch } = useQuery<GetTasksByStatusData>(GET_TASKS_BY_STATUS, {
    variables: { taskStatus: status },
  });

  const { loading: usersLoading, error: usersError, data: usersData } = useQuery<GetUsersData>(GET_USERS);

  const [updateTask] = useMutation(UPDATE_TASK);
  const [deleteTask] = useMutation(DELETE_TASK);
  const [assignTask] = useMutation(ASSIGN_TASK);
  const [unassignTask] = useMutation(UNASSIGN_TASK);
  const [updateTaskStatus] = useMutation(UPDATE_TASK_STATUS);

  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [assigningTask, setAssigningTask] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [taskDescription, setTaskDescription] = useState<string>("");
  const [editingStatusTaskId, setEditingStatusTaskId] = useState<string | null>(null); // Для изменения статуса
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const availableStatuses = ["to-do", "in progress", "blocked", "done"];

  useEffect(() => {
    if (loading) console.log("loading tasks");
    if (error) console.error("Error fetching tasks", error);
    if (data) console.log("Fetched tasks", data.tasksByStatus);
  }, [data, loading, error]);

  const showTasksByStatus = () => {
    if (loading || usersLoading) return <p>Loading...</p>;
    if (error || usersError) return <p>Error: {error ? error.message : usersError?.message}</p>;

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
                {task.assignedTo && task.assignedTo.username ? (
                <div style={{marginBottom: "10px"}}>
                <span className={styles["assign-text"]}>
                      {task.assignedTo.username}
                </span>
                 <button
                      style={{ marginLeft: "10px", color: "black" }}
                      onClick={() => handleUnassignTask(task.id)}
                        >
                        Unassign
                        </button>
                       </div>
                    ) : (
                        <p className={styles["assign-text"]}>Unassigned</p>
                      )}

              <button style={{marginRight: "10px"}} onClick={() => setEditingStatusTaskId(task.id)}>
                Change status
              </button>

              {editingStatusTaskId === task.id && (
                <div>
                  <select
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    value={selectedStatus || ""}
                  >
                    <option value="" disabled>Select new status</option>
                    {availableStatuses.map((statusOption) => (
                      <option key={statusOption} value={statusOption}>
                        {statusOption}
                      </option>
                    ))}
                  </select>
                  <button onClick={() => handleChangeStatus(task.id)}>Save</button>
                  <button onClick={() => setEditingStatusTaskId(null)}>Cancel</button>
                </div>
              )}

                <button onClick={() => setEditingTask(task.id)}>Edit</button>
                <button style={{ marginLeft: "10px" }} onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
                <button
                  style={{ marginLeft: "10px" }}
                  onClick={() => setAssigningTask(task.id === assigningTask ? null : task.id)}
                >
                  Assign
                </button>
                {assigningTask === task.id && (
                  <div>
                    <select
                      onChange={(e) => setSelectedUser(e.target.value)}
                      value={selectedUser || ""}
                    >
                      <option value="" disabled>
                        Select user
                      </option>
                      {usersData?.users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => handleAssignTask(task.id)}>Assign Task</button>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const handleUpdateTask = async (id: string) => {
    try {
      await updateTask({ variables: { id, title: taskTitle, description: taskDescription } });
      setEditingTask(null);
      refetch();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask({ variables: { id } });
      refetch();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAssignTask = async (id: string) => {
    if (!selectedUser) {
      alert("Please select a user to assign the task to.");
      return;
    }

    try {
      await assignTask({ variables: { id, assignedTo: selectedUser } });
      refetch();
      setAssigningTask(null);
      setSelectedUser(null);
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  const handleUnassignTask = async (id: string) => {
    try {
      await unassignTask({ variables: { id } });
      refetch();
    } catch (error) {
      console.error("Error unassigning task:", error);
    }
  };

  const handleChangeStatus = async (taskId: string) => {
    if (!selectedStatus) {
      alert("Please select a status.");
      return;
    }

    try {
      await updateTaskStatus({
        variables: { id: taskId, taskStatus: selectedStatus },
      });
      refetch(); // Перезапрос данных после изменения статуса
      setEditingStatusTaskId(null); // Закрыть меню выбора статуса
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  return <div>{showTasksByStatus()}</div>;
};

export default TasksByStatus;

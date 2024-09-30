"use client"

import { useQuery } from "@apollo/client"
import { useEffect } from "react"
import { GET_TASKS_BY_STATUS } from "@/app/queries/taskQueries"


interface TaskByStatus {
    id: string;
    title: string;
    description: string;
    taskStatus: string;
  }

interface GetTasksByStatusData {
    tasksByStatus: TaskByStatus[];
  }

const TasksByStatusInProgress = () => {
    const { loading, error, data } = useQuery<GetTasksByStatusData>(GET_TASKS_BY_STATUS, {
        variables: { taskStatus: "in progress" },
    })

useEffect(()=> {
    if (loading) {
        console.log("loading tasks")
    }
    if (error) {
        console.error("Error fetching tasks", error)
    }
    if (data) {
        console.log("Fetched tasks", data.tasksByStatus)
    }
}, [data, loading, error])

const showTasksByStatus = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    if (!data || !data.tasksByStatus || data.tasksByStatus.length === 0) {
      return <p>No tasks found.</p>;
    }

    return (
         <ul style={{listStyle: "none"}}>
            {data.tasksByStatus.map(task => (
                <li style={{marginLeft: "10px", marginBlock: "10px"}} key={task.id}>{task.title}</li>
            ))}
         </ul>
    )
}
    return <div>{showTasksByStatus()}</div>;
}
export default TasksByStatusInProgress
import { gql } from "@apollo/client";

export const GET_TASKS = gql`
    query getTasks {
        tasks {
        id
        title
        taskStatus
        description
        assignedTo{
            username
        }
        createdAt
        finishedBy
        }
        }
        `

export const GET_TASKS_BY_STATUS = gql`
 query getTasksByStatus($taskStatus: String!) {
    tasksByStatus(taskStatus: $taskStatus) {
      id
      title
      taskStatus
      description
      assignedTo {
        username
      }
      createdAt
      finishedBy
    }
  }
`;


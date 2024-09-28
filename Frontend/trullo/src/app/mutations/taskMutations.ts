import { gql } from "@apollo/client";

export const CREATE_TASK = gql`
  mutation createTask(
    $title: String!,
    $description: String!,
    $taskStatus: String
  ) {
    createTask(
      title: $title,
      description: $description,
      taskStatus: $taskStatus
    ) {
      id
      title
      description
      taskStatus
      
    }
  }
`;


export const UPDATE_TASK = gql`
  mutation updateTask(
    $id: ID!, 
    $title: String!,
    $description: String!,
    $taskStatus: String!
  
){
    updateTask (
    id: $id,
    title: $title,
    description: $description,
    taskStatus: $taskStatus,
    
    )    {
        id
        title
        description
        taskStatus
        assignedTo{
            username
        }
    }
}
    `
    export const UPDATE_TASK_STATUS = gql`
  mutation updateTaskStatus($id: ID!, $taskStatus: String!) {
    updateTaskStatus(id: $id, taskStatus: $taskStatus) {
      id
      title
      description
      taskStatus
    }
  }
`;

    export const DELETE_TASK = gql`
    mutation deleteTask($id: ID!) {
      deleteTask(id: $id) {
        id
      }
    }
  `

  export const ASSIGN_TASK = gql`
  mutation assignTaskToUser(
    $id: ID!, 
    $userId: ID!,
){
    assignTaskToUser (
    taskId: $id,
    userId: $userId
    )    {
        id
        title
        description
        taskStatus
        assignedTo{
            username
        }
    }
}
    `

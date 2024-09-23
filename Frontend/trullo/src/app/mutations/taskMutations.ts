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
      taskStatus: $taskStatus // Этот параметр можно передавать из клиента, если нужно
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
    $assignedTo: String
){
    updateTask (
    id: $id,
    title: $title,
    description: $description,
    taskStatus: $taskStatus,
    assignedTo: $assignedTo
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

    export const DELETE_TASK = gql`
    mutation deleteTask($id: ID!) {
      deleteTask(id: $id) {
        id
      }
    }
  `

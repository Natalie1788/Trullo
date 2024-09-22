import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
      email
      tasks {
        title
        description
      }
    }
  }
`
export const GET_USER_BY_ID = gql`
    query getUserById($id: ID!) {
        user(id: $id) {
            id
            username
            email
            tasks {
                title
                description
            }
        }
    }
`
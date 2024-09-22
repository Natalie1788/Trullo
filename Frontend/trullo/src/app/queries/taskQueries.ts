import { gql } from "@apollo/client";

export const GET_TASKS = gql`
    query getTasks {
        tasks {
        id
        title
        description
        assignedTo{
            username
        }
        createdAt
        finishedBy
        }
        }
        `
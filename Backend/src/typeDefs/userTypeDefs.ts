
const userTypeDefs = `
type User {
    id: ID!
    username: String
    email: String!
    password: String!
    tasks: [Task]
}

type LoginResponse {
  user: User
  token: String!
}

type Query {
    users: [User!]!
    user(id: ID!): User
    }

type Mutation {
    registerUser (username: String!, password: String!, email: String!) : User
    loginUser (email: String!, password: String!) : LoginResponse
    updateUser (id: ID!, username: String, email: String): User
    deleteUser(id: ID!): User
    logoutUser: Boolean 
}

`
export default userTypeDefs;
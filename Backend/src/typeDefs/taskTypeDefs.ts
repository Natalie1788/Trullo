
const taskTypeDefs = `
scalar Date

type Task {
    id: ID!
    title: String!
    description: String!
    taskStatus: String!
    assignedTo: User
    createdAt: Date!
    finishedBy: Date
}

type Query {
    tasks: [Task]!
    task(id: ID!): Task!
    }
    
type Mutation {
  createTask(
    title: String!
    description: String
    taskStatus: String!
    assignedTo: ID
  ): Task
  updateTask(
    id: ID!
    title: String
    description: String
    taskStatus: String
    assignedTo: ID
  ): Task
  deleteTask(id: ID!): Task
}  
`

export default taskTypeDefs 
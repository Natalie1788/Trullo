
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
    description: String!
    taskStatus: String!
  ): Task
  updateTask(
    id: ID!
    title: String
    description: String
    taskStatus: String
  ): Task
  deleteTask(id: ID!): Task
  assignTaskToUser(
    taskId: ID!
    assignedTo: ID!
  ): Task
}  
`

export default taskTypeDefs 
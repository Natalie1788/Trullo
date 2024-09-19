import Task from "../models/taskModel";
import User from "../models/userModel";
import { TaskResolvers } from "../types/taskTypes";
import { GraphQLScalarType, Kind } from "graphql";

const dateScalar = new GraphQLScalarType({
  name: 'Date',
  description: 'Custom scalar type for date',
  parseValue(value: string) {
    return new Date(value); // Преобразует значение из входных данных в объект Date
  },
  serialize(value: Date) {
    return value.toISOString(); // Преобразует объект Date в строку для ответа
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // Преобразует значение литерала в объект Date
    }
    return null;
  },
});


const taskResolvers: TaskResolvers = {
  Date: dateScalar,
    Query: {
        tasks: async () => {
            try {
                const tasks = await Task.find({}).populate("assignedTo");
                return tasks;
            } catch (error) {
                throw new Error("Error fetching tasks");
            }
        },
        task: async (_, { id }) => {
            try {
                const task = await Task.findById(id).populate("assignedTo");
                if (!task) throw new Error("Task not found");
                return task;
            } catch (error) {
                throw new Error("Error fetching task");
            }
        }
    },
    Mutation: {
        createTask: async (_, {title, description, taskStatus, assignedTo}) => {
            try{
            const task = new Task({title, description, taskStatus, assignedTo});
            const savedTask = await task.save();

            await User.findByIdAndUpdate(assignedTo, {
              $push: { tasks: savedTask._id },
            });
            return savedTask.populate('assignedTo');
          } catch (error) {
            throw new Error("Error creating recipe")
          }
        },
        updateTask: async (_, { id, title, description, taskStatus, assignedTo }: { id: string; title?: string; description?: string; taskStatus?: string; assignedTo?: string }) => {
            try {
              const updatedTask = await Task.findByIdAndUpdate(
                id,
                { title, description, taskStatus, assignedTo },
                { new: true }
              ).exec();
      
              if (!updatedTask) throw new Error("Task not found");
      
              return updatedTask.populate("assignedTo");
            } catch (error) {
              throw new Error("Error updating task");
            }
          },
          deleteTask: async (_, { id }: { id: string }) => {
            try {
              const deletedTask = await Task.findByIdAndDelete(id).exec();
      
              if (!deletedTask) throw new Error("Task not found");
      
              // Remove task reference from the assigned user's task list
              if (deletedTask.assignedTo) {
                await User.findByIdAndUpdate(deletedTask.assignedTo, {
                  $pull: { tasks: deletedTask._id },
                }).exec();
              }
      
              return deletedTask;
            } catch (error) {
              throw new Error("Error deleting task");
            }
          },
        },
}

export default taskResolvers;
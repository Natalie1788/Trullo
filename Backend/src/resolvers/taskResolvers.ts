import Task from "../models/taskModel";
import User from "../models/userModel";
import { TaskResolvers } from "../types/taskTypes";
import { GraphQLScalarType, Kind } from "graphql";
import mongoose from "mongoose";

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
        tasksByStatus: async (_, { taskStatus }) => {
          try {
            // Если статус не передан, вернуть пустой массив
            if (!taskStatus) {
              return [];
            }
        
            // Если статус передан, отфильтровать задачи по статусу
            const tasks = await Task.find({ taskStatus: taskStatus }).populate("assignedTo");
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
        createTask: async (_, {title, description, taskStatus}) => {
            try{
            const task = new Task({title, description, taskStatus});
            const savedTask = await task.save();

           
            return savedTask;
          } catch (error) {
            throw new Error("Error creating recipe")
          }
        },
        updateTask: async (_, { id, title, description }) => {
            try {
              const updatedTask = await Task.findByIdAndUpdate(
                id,
                { title, description },
                { new: true }
              );
      
              if (!updatedTask) throw new Error("Task not found");
      
              return updatedTask.populate("assignedTo");
            } catch (error) {
              throw new Error("Error updating task");
            }
          },
          updateTaskStatus: async (_, { id, taskStatus }) => {
            try {
              // Обновление только статуса задачи
              const updatedTask = await Task.findByIdAndUpdate(
                id,
                { taskStatus }, // Обновляется только taskStatus
                { new: true } // Вернуть обновлённый объект
              );
              
              if (!updatedTask) throw new Error("Task not found");
              
              return updatedTask.populate("assignedTo"); // Пополнение assignedTo для возврата пользователя
            } catch (error) {
              throw new Error("Error updating task status");
            }
          },
          assignTaskToUser: async (_, { taskId, assignedTo }) => {
            try {
              // Convert the assignedTo (user ID) to an ObjectId
              const assignedToObjectId = new mongoose.Types.ObjectId(assignedTo);
          
              // Update the task with the assigned user
              const assignedTask = await Task.findByIdAndUpdate(
                taskId,
                { assignedTo: assignedToObjectId },
                { new: true }
              ).populate("assignedTo") ;
          
              if (!assignedTask) throw new Error("Task not found");
             
    console.log("Assigned to:", assignedTask.assignedTo);
          
    const updatedUser = await User.findByIdAndUpdate(
      assignedToObjectId,
      { $push: { tasks: taskId } }, 
      { new: true }
    );
          
              return assignedTask;
            } catch (error) {
              throw new Error("Error assigning task");
            }
          },
    unassignTask: async (_, { id }) => {
            try {
              // Найти задачу и установить поле assignedTo в null (удалить назначенного пользователя)
              const updatedTask = await Task.findByIdAndUpdate(
                id,
                { assignedTo: null },
                { new: true }
              );
          
              if (!updatedTask) {
                throw new Error("Task not found");
              }
          
              return updatedTask.populate("assignedTo");
            } catch (error) {
              throw new Error("Error unassigning task");
            }
    },
  
          
          deleteTask: async (_, { id }: { id: string }) => {
            try {
              const deletedTask = await Task.findByIdAndDelete(id);
      
              if (!deletedTask) throw new Error("Task not found");
      
              // Remove task reference from the assigned user's task list
              if (deletedTask.assignedTo) {
                await User.findByIdAndUpdate(deletedTask.assignedTo, {
                  $pull: { tasks: deletedTask._id },
                });
              }
      
              return deletedTask;
            } catch (error) {
              throw new Error("Error deleting task");
            }
          },
          
        },
}

export default taskResolvers;
import { Document, Types } from "mongoose";
import { GraphQLResolveInfo, GraphQLScalarType } from "graphql";
import { Request } from "express";

// Интерфейс для задания
export interface ITask extends Document {
  title: string;
  description?: string;
  taskStatus: 'to-do' | 'in progress' | 'blocked' | 'done';
  assignedTo?: Types.ObjectId; 
  createdAt: Date;
  finishedBy?: Date;
}

// Интерфейс для контекста
export interface IContext {
  req: Request;
  token?: string;
}

// Аргументы для мутаций
interface ICreateTaskArgs {
  title: string;
  description?: string;
  taskStatus: 'to-do' | 'in progress' | 'blocked' | 'done';
  assignedTo?: string;
}
interface ITaskQueryArgs {
  taskStatus?: 'to-do' | 'in progress' | 'blocked' | 'done'; 
}

interface IUpdateTaskArgs {
  id: string;
  title?: string;
  description?: string;
  
}

interface IUpdateTaskStatusArgs{
  id: string;
  taskStatus?: 'to-do' | 'in progress' | 'blocked' | 'done';
}

interface IAssignTaskArgs {
  id: string;
  assignedTo: string; 
}
interface IUnassignTaskArgs {
  id: string;
}

interface IDeleteTaskArgs {
  id: string;
}

// Резолверы
export type TaskResolvers = {
  Date: GraphQLScalarType;
  Query: {
    tasks: (
      parent: unknown,
      args: Record<string, unknown>,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<ITask[]>;
    task: (
      parent: unknown,
      args: { id: string },
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<ITask | null>;
    tasksByStatus: (
      parent: unknown,
      args: ITaskQueryArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<ITask[]>;
  };
  Mutation: {
    createTask: (
      parent: unknown,
      args: ICreateTaskArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<ITask>;
    updateTask: (
      parent: unknown,
      args: IUpdateTaskArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<ITask | null>;
    updateTaskStatus: (
      parent: unknown,
      args: IUpdateTaskStatusArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<ITask | null>;
    assignTaskToUser: (
      parent: unknown,
      args: IAssignTaskArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<ITask | null>;
    unassignTask: (
      parent: unknown,
      args: IUnassignTaskArgs,
      context: IContext,
      info: GraphQLResolveInfo
    )=> Promise<ITask | null>;
    deleteTask: (
      parent: unknown,
      args: IDeleteTaskArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<ITask | null>;
  };
};

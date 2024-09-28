import { Document, Types } from "mongoose";
import { GraphQLResolveInfo } from "graphql";
import { Request } from "express";

// Интерфейс для пользователя
export interface IUser extends Document {
    username?: string;
    email: string;
    password: string;
    token?: string;
    tasks?: Types.ObjectId[];
    role: 'admin' | 'user'; // Роль пользователя
    comparePassword(candidatePassword: string): Promise<boolean>;
  }

  export interface IUserWithToken extends IUser{
    _id: string;
  }

// Интерфейс для контекста
export interface IContext {
  req: Request;
  token?: string;
  user?: IUserWithToken;
}

// Аргументы для мутаций
interface IRegisterArgs {
  username: string;
  email: string;
  password: string;
}

interface ILoginArgs {
  email: string;
  password: string;
}

interface IUpdateArgs {
  id: string;
  username: string;
  email: string;
}

interface IDeleteArgs {
  id: string;
}

// Резолверы
export type UserResolvers = {
  Query: {
    users: (
      parent: unknown,
      args: Record<string, unknown>,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<IUser[]>;
    user: (
      parent: unknown,
      args: { id: string },
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<IUser | null>;
    currentUser: (
      parent: unknown,
      args: Record<string, unknown>,
      context: IContext,
      info: GraphQLResolveInfo
  ) => Promise<IUser | null>;
  };
  Mutation: {
    registerUser: (
      parent: unknown,
      args: IRegisterArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<{ user: IUser | null}>;
    loginUser: (
      parent: unknown,
      args: ILoginArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<{ user: IUserWithToken; token: string }>;
    logoutUser: (
      parent: unknown,
      args: Record<string, unknown>,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<boolean>;
    updateUser: (
      parent: unknown,
      args: IUpdateArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<IUser | null>;
    deleteUser: (
      parent: unknown,
      args: IDeleteArgs,
      context: IContext,
      info: GraphQLResolveInfo
    ) => Promise<IUser | null>;
  };
};

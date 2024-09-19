import mongoose, { Document, Model, Schema, Types }  from "mongoose";
import { ITask } from "../types/taskTypes";

    
  const taskSchema = new Schema<ITask>({
    title: { type: String, required: true },
    description: { type: String },
    taskStatus: {
      type: String,
      enum: ['to-do', 'in progress', 'blocked', 'done'],
      default: 'to-do',
    },
    assignedTo: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' // Связь с моделью User
    },
    createdAt: { type: Date, default: Date.now },
    finishedBy: { type: Date }
  });

const Task: Model<ITask> = mongoose.model('Task', taskSchema, "tasks")
export default Task
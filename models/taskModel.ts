import { Schema, Document, model, Model } from "mongoose";

export interface TaskAttrs {
  id: string;
  title: string;
  content: string;
}

export interface TaskModel extends Model<TaskDocument> {
  addOne(doc: TaskAttrs): TaskDocument;
}
export interface TaskDocument extends Document {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
export const taskSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.statics.addOne = (doc: TaskAttrs) => {
  return new Task(doc);
};
export const Task = model<TaskDocument, TaskModel>("Task", taskSchema);

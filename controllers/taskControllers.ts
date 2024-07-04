import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyPluginAsync,
} from "fastify";
import fp from "fastify-plugin";
import { Db } from "../config/database";
import { TaskAttrs } from "../models/taskModel";

// Declaration merging
declare module "fastify" {
  export interface FastifyInstance {
    db: Db;
  }
}

interface taskBody {
  title: string;
  description: string;
  createdAt: string;
}

interface taskParams {
  id: string;
  title: string;
  description: string;
}

const TaskRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  options: FastifyPluginOptions
) => {
  server.get("/getTasks", {}, async (request, reply) => {
    try {
      const { Task } = server.db.models;
      const tasks = await Task.find({});
      return reply.code(200).send(tasks);
    } catch (error) {
      request.log.error(error);
      return reply.send(500);
    }
  });

  server.get<{ Params: taskParams }>(
    "/getTask/:id",
    {},
    async (request, reply) => {
      try {
        const ID: String = request.params.id;
        const { Task } = server.db.models;
        const task = await Task.findOne({ id: ID });
        if (!task) {
          return reply.send(404);
        }
        return reply.code(200).send(task);
      } catch (error) {
        request.log.error(error);
        return reply.send(400);
      }
    }
  );

  server.post<{ Body: TaskAttrs }>(
    "/createTask",
    {},
    async (request, reply) => {
      try {
        const { Task } = server.db.models;
        const task = await Task.addOne(request.body);
        await task.save();
        return reply.code(201).send(task);
      } catch (error) {
        request.log.error(error);
        return reply.send(500);
      }
    }
  );

  server.put<{ Body: taskBody; Params: taskParams }>(
    "/updateTask/:id",
    {},
    async (request, reply) => {
      try {
        const ID = request.params.id;
        const { Task } = server.db.models;

        const title: String = request.body.title;
        const description: String = request.body.description;

        const task = await Task.findOneAndUpdate(
          { id: ID },
          { id: ID, title, description, updatedAt: Date.now() }
        );
        if (!task) {
          return reply.send(404);
        }
        return reply.code(200).send(task);
      } catch (error) {
        request.log.error(error);
        return reply.send(400);
      }
    }
  );

  server.delete<{ Params: taskParams }>(
    "/deleteTask/:id",
    {},
    async (request, reply) => {
      try {
        const ID: String = request.params.id;
        const { Task } = server.db.models;
        const task = await Task.findOneAndDelete({ id: ID });
        if (!task) {
          return reply.send(404);
        }
        return reply.code(200).send(task);
      } catch (error) {
        request.log.error(error);
        return reply.send(400);
      }
    }
  );
};
export default fp(TaskRoute);

import fastify from "fastify";

import db from "./config/database";
import TaskRoutes from "./controllers/taskControllers";

require("dotenv").config();

const uri: string = process.env.DB_URL;

const app = fastify({
  logger: true,
});

const PORT: number = process.env.PORT || 4000;

const start = async () => {
  try {
    await app.listen(PORT);
    console.log("Server started successfully");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();

app.register(db, { uri });
app.register(TaskRoutes);

app.get("/", async (req, res) => {
  res.send("<h1>Home Directory.</h1>");
});

import express, { RequestHandler } from "express";

const app = express();

app.use(express.json());

const requestLoggerMiddleware: RequestHandler = (req, res, next) => {
  console.log("New Request:", req.path, "- body:", req.body);
  next();
};

app.use(requestLoggerMiddleware);

app.listen(3000);

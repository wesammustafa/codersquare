import dotenv from 'dotenv';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';
import fs from 'fs';
import https from 'https';

import { db, initDb } from './datastore';
import { signInHandler, signUpHandler } from './handlers/authHandler';
import { createPostHandler, listPostHandler } from './handlers/postHandler';
import { authMiddleware } from './middleware/authMiddleware';
import { errHandler } from './middleware/errorMiddleware';
import { requestLoggerMiddleware } from './middleware/loggerMiddleware';

(async () => {
  await initDb();
  dotenv.config();
  const app = express();

  app.use(express.json());

  app.use(requestLoggerMiddleware);

  // Public endpoints
  app.get('/healthz', (req, res) => res.send({ status: '✌️' }));
  app.post('/v1/signup', asyncHandler(signUpHandler));
  app.post('/v1/signin', asyncHandler(signInHandler));

  app.use(authMiddleware);

  // Protected endpoints
  app.get('/v1/posts', asyncHandler(listPostHandler));
  app.post('/v1/posts', asyncHandler(createPostHandler));

  app.use(errHandler);

  const port = process.env.PORT;
  const env = process.env.ENV;
  const listener = () => console.log(`Listening on port ${port} on ${env} environment`);

  if (env === 'production') {
    const key = fs.readFileSync('/path to key', 'utf-8');
    const cert = fs.readFileSync('/path to cert', 'utf-8');

    https.createServer({ key, cert }, app).listen(port, listener);
  } else {
    app.listen(port, listener);
  }
})();

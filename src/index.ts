import * as dotenv from 'dotenv';
dotenv.config();
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import { Routes } from './routes';
import { seeds } from './seed/seeds';

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const sess: session.SessionOptions = {
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    };
    if (process.env.ENV === 'PROD') {
      app.set('trust proxy', 1);
      sess.cookie.secure = true;
      sess.cookie.sameSite = 'none';
    }
    app.use(session(sess));
    app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](`/api/${route.route}`, (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action](req, res, next);
        if (result instanceof Promise) {
          result.then((result) => res.json(result));
        } else {
          res.json(result);
        }
      });
    });

    app.listen(4000);

    // insert data for test
    // await seeds();

    console.log('Express server has started on port 4000');
  })
  .catch((error) => console.log(error));

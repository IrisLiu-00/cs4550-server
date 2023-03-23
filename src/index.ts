import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import { Routes } from './routes';
import { User } from './entity/User';
import { UserRole } from './types';
import { Team } from './entity/Team';

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](`/api/${route.route}`, (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action](req, res, next);
        if (result instanceof Promise) {
          result.then((result) => (result !== null && result !== undefined ? res.send(result) : undefined));
        } else if (result !== null && result !== undefined) {
          res.json(result);
        }
      });
    });

    app.listen(4000);

    // insert data for test
    const user = User.create({
      email: 'hello@email.com',
      password: '123123',
      displayName: 'liui',
      role: UserRole.LEADER,
    });
    const team = Team.create({
      id: 'The Panthers',
      color: '#f25edc',
      description: 'Pink and pretty! We love to write feel good stories about nice things.',
      lead: user,
    });
    user.team = team;
    await team.save();
    await user.save();

    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Phantom",
    //         lastName: "Assassin",
    //         age: 24
    //     })
    // )

    console.log('Express server has started on port 4000');
  })
  .catch((error) => console.log(error));

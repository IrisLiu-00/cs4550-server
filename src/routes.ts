import { StoryController } from './controller/StoryController';
import { UserController } from './controller/UserController';

export const Routes = [
  {
    method: 'get',
    route: 'users/:id',
    controller: UserController,
    action: 'get',
  },
  {
    method: 'get',
    route: 'users',
    controller: UserController,
    action: 'getProfile',
  },
  {
    method: 'patch',
    route: 'users/:id',
    controller: UserController,
    action: 'patch',
  },
  {
    method: 'get',
    route: 'stories/:id',
    controller: StoryController,
    action: 'get',
  },
  {
    method: 'post',
    route: 'stories/:id',
    controller: StoryController,
    action: 'postLine',
  },
];

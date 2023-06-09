import { StoryController } from './controller/StoryController';
import { TeamController } from './controller/TeamController';
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
    method: 'post',
    route: 'users/signup',
    controller: UserController,
    action: 'signup',
  },
  {
    method: 'post',
    route: 'users/login',
    controller: UserController,
    action: 'login',
  },
  {
    method: 'post',
    route: 'users/logout',
    controller: UserController,
    action: 'logout',
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
  {
    method: 'delete',
    route: 'stories/:id/:lineId',
    controller: StoryController,
    action: 'deleteLine',
  },
  {
    method: 'get',
    route: 'stories/search/:criteria',
    controller: StoryController,
    action: 'getSearch',
  },
  {
    method: 'get',
    route: 'stories/recent/global',
    controller: StoryController,
    action: 'getRecentGlobal',
  },
  {
    method: 'get',
    route: 'stories/recent/user/:id',
    controller: StoryController,
    action: 'getRecentForUser',
  },
  {
    method: 'get',
    route: 'stories/recent/team/:id',
    controller: StoryController,
    action: 'getRecentForTeam',
  },
  {
    method: 'get',
    route: 'stories/features/team/:id',
    controller: StoryController,
    action: 'getFeaturesForTeam',
  },
  {
    method: 'patch',
    route: 'stories/:id/features',
    controller: StoryController,
    action: 'toggleFeature',
  },
  {
    method: 'get',
    route: 'teams',
    controller: TeamController,
    action: 'getAll',
  },
  {
    method: 'get',
    route: 'teams/:id',
    controller: TeamController,
    action: 'get',
  },
  {
    method: 'patch',
    route: 'teams/:id',
    controller: TeamController,
    action: 'patch',
  },
];

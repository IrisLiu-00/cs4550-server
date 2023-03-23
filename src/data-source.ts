import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Feature } from './entity/Feature';
import { Line } from './entity/Line';
import { Team } from './entity/Team';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'storyline',
  password: 'storyline123',
  database: 'storyline',
  synchronize: true,
  logging: false,
  entities: [User, Team, Line, Feature],
  migrations: [],
  subscribers: [],
});

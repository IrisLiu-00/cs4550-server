import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Feature } from './entity/Feature';
import { Line } from './entity/Line';
import { Team } from './entity/Team';
import { User } from './entity/User';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: 5432,
  username: 'storyline',
  password: process.env.DB_PASSWORD,
  database: 'storyline',
  synchronize: true,
  logging: false,
  entities: [User, Team, Line, Feature],
  migrations: [],
  subscribers: [],
});

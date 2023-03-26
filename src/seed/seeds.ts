import { Feature } from '../entity/Feature';
import { Line } from '../entity/Line';
import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { UserRole } from '../types';
import { AppDataSource } from '../data-source';

async function deleteAll(model: any): Promise<void> {
  await AppDataSource.createQueryBuilder().delete().from(model).execute();
}

export const seeds = async () => {
  await deleteAll(Line);
  await deleteAll(Feature);
  await deleteAll(Team);
  await deleteAll(User);

  const leader = User.create({
    email: 'hello@email.com',
    password: '123123',
    displayName: 'liui',
    role: UserRole.LEADER,
  });
  const team = Team.create({
    id: 'The Panthers',
    color: '#f25edc',
    description: 'Pink and pretty! We love to write feel good stories about nice things.',
    lead: leader,
  });
  leader.team = team;
  const writer = User.create({
    email: 'hello@email.com',
    password: '123123',
    displayName: 'cat',
    role: UserRole.WRITER,
    team: team,
  });
  await team.save();
  await leader.save();
  await writer.save();
};

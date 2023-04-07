import { request } from 'express';
import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { UserRole } from '../types';

export class UserService {
  async registerLeader(body: any) {
    const { email, username, password, teamName, teamDesc, teamColor } = body;
    const oldTeam = await Team.findOne({ where: { id: teamName } });
    if (oldTeam) {
      throw new Error('Team name already in use');
    }
    let team: Team;
    team = await Team.create({ id: teamName, color: teamColor, description: teamDesc }).save();

    const user = await User.create({
      email,
      password,
      role: UserRole.LEADER,
      displayName: username,
      teamId: team.id,
    }).save();
    team.leadId = user.id;
    team.save();
    return user;
  }

  async registerMember(body: any) {
    const { email, username, password, selectedTeam } = body;

    const user = await User.create({
      email,
      password,
      role: UserRole.WRITER,
      displayName: username,
      teamId: selectedTeam,
    }).save();
    return user;
  }
}

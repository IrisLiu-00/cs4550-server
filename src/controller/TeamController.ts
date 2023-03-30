import { Line } from '../entity/Line';
import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { TeamSummary, UserRole } from '../types';

export class TeamController {
  // Get summary of all teams
  async getAll(): Promise<TeamSummary[]> {
    const teamData = await User.createQueryBuilder('user')
      .select('user.teamId', 'id')
      .addSelect('team.color', 'color')
      .addSelect('team.description', 'description')
      .addSelect('team.leadId', 'leadId')
      .addSelect('COUNT(DISTINCT line.id) / COUNT(DISTINCT user.id)', 'score')
      .leftJoin(Line, 'line', 'line.userId = user.id')
      .innerJoin(Team, 'team', 'user.teamId = team.id')
      .where('user.role = :writer', { writer: UserRole.WRITER })
      .groupBy('user.teamId')
      .orderBy('score', 'DESC')
      .getRawMany();

    return teamData;
  }
}

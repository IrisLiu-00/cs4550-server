import { Line } from '../entity/Line';
import { Team } from '../entity/Team';
import { User } from '../entity/User';
import { UserRole } from '../types';

export class TeamService {
  async getTeamSummary(teamId?: string) {
    let query = User.createQueryBuilder('user')
      .select('user.teamId', 'id')
      .addSelect('MIN(team.color)', 'color')
      .addSelect('MIN(team.description)', 'description')
      .addSelect('MIN(team.leadId)', 'leadId')
      .addSelect('COUNT(DISTINCT line.id) / COUNT(DISTINCT user.id)', 'score')
      .leftJoin(Line, 'line', 'line.userId = user.id')
      .innerJoin(Team, 'team', 'user.teamId = team.id')
      .where('user.role = :writer', { writer: UserRole.WRITER });

    if (teamId) query = query.where('team.id = :teamId', { teamId });

    return await query.groupBy('user.teamId').orderBy('score', 'DESC').getRawMany();
  }
}

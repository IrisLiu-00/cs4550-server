import { User } from '../entity/User';
import { TeamDetail, TeamSummary, UserRole } from '../types';
import { Request, Response } from 'express';
import { TeamService } from './TeamService';
import { Team } from '../entity/Team';

export class TeamController {
  teamService = new TeamService();

  // Get summary of all teams
  async getAll(): Promise<TeamSummary[]> {
    return await this.teamService.getTeamSummary();
  }

  async get(request: Request, response: Response): Promise<TeamDetail> {
    const teamId = request.params.id;
    const teamData = await this.teamService.getTeamSummary(teamId);
    if (!teamData.length) {
      response.status(404);
      return;
    }
    const team = teamData[0];
    const members = await User.find({
      select: { id: true, teamId: true, displayName: true },
      where: { teamId, role: UserRole.WRITER },
    });
    team.members = members;
    return team;
  }

  async patch(request: Request, response: Response) {
    // TODO: perms check?
    const id = request.params.id;
    const team = await Team.findOne({ where: { id } });
    if (!team) {
      response.status(404);
      return;
    }
    const { description, color } = request.body;
    team.description = description;
    team.color = color;

    try {
      await team.save();
      return team;
    } catch (err) {
      console.error(err.message);
      response.status(400);
      if (err.code === 'ER_DUP_ENTRY') return 'Team name already in use.';
    }
  }
}

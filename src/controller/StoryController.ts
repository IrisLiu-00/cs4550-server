import axios from 'axios';
import { Request, Response } from 'express';
import { Line } from '../entity/Line';
import { StoryDetail, StorySummary } from '../types';
import { StoryService } from './StoryService';

export class StoryController {
  storyService = new StoryService();

  // Get stories matching search
  async getSearch(request: Request, response: Response): Promise<StorySummary[]> {
    try {
      const data = await this.storyService.getArtBySearch(request.params.criteria);
      const ids = data.map((story) => story.id);
      const lineData = await Line.createQueryBuilder('line')
        .select('line.artId', 'artId')
        .addSelect('COUNT(*)', 'length')
        .addSelect('MAX(line.timestamp)', 'updatedAt')
        .where(`line.artId IN (${ids.join(',')})`)
        .groupBy('line.artId')
        .getRawMany();
      return this.storyService.formatStorySummaries(data, lineData);
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  // Get most recent active stories, globally
  async getRecentGlobal(request: Request, response: Response): Promise<StorySummary[]> {
    try {
      const lineData = await Line.createQueryBuilder('line')
        .select('line.artId', 'artId')
        .addSelect('COUNT(*)', 'length')
        .addSelect('MAX(line.timestamp)', 'updatedAt')
        .groupBy('line.artId')
        .orderBy('"updatedAt"', 'DESC')
        .limit(12)
        .getRawMany();
      const artIds = lineData.map((line) => line.artId);
      const data = await this.storyService.getArtByIds(artIds);
      return this.storyService.formatStorySummaries(data, lineData);
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  // Get logged in user's most recent stories  /stories/recent/user/:id
  async getRecentForUser(request: Request, response: Response): Promise<StorySummary[]> {
    const userId = parseInt(request.params.id);
    try {
      const lineData = await Line.createQueryBuilder('line')
        .select('line.artId', 'artId')
        .addSelect('COUNT(*)', 'length')
        .addSelect('MAX(line.timestamp)', 'updatedAt')
        .where('line.userId = :userId', { userId })
        .groupBy('line.artId')
        .orderBy('"updatedAt"', 'DESC')
        .limit(12)
        .getRawMany();
      const artIds = lineData.map((line) => line.artId);
      const data = await this.storyService.getArtByIds(artIds);
      return this.storyService.formatStorySummaries(data, lineData);
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  // Get most recent stories for team /stories/recent/team/:id
  async getRecentForTeam(request: Request, response: Response): Promise<StorySummary[]> {
    const teamId = request.params.id;
    try {
      // TODO: abstract this query somehow
      const lineData = await Line.createQueryBuilder('line')
        .select('line.artId', 'artId')
        .addSelect('COUNT(*)', 'length')
        .addSelect('MAX(line.timestamp)', 'updatedAt')
        .innerJoin('line.user', 'user')
        .where('user.teamId = :teamId', { teamId })
        .groupBy('line.artId')
        .orderBy('"updatedAt"', 'DESC')
        .limit(12)
        .getRawMany();
      const artIds = lineData.map((line) => line.artId);
      const data = await this.storyService.getArtByIds(artIds);
      return this.storyService.formatStorySummaries(data, lineData);
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  // Get featured stories for team /stories/featured/team/:id or maybe move to features endpoint

  // Get details for one story
  async get(request: Request, response: Response): Promise<StoryDetail> {
    const id = parseInt(request.params.id);

    try {
      const resp = await axios.get(
        `https://api.artic.edu/api/v1/artworks/${id}?fields=id,image_id,thumbnail,title,artist_display,date_display`
      );
      const data = resp.data.data;
      data.imageUrl = `https://www.artic.edu/iiif/2/${data.image_id}/full/843,/0/default.jpg`;
      data.lines = await Line.find({
        select: { text: true, timestamp: true, id: true, user: { id: true, teamId: true, displayName: true } },
        where: { artId: id },
        relations: { user: true },
      });
      return data;
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  // Post new line for story
  async postLine(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    const { lineText } = request.body;
    // TODO: get userID from token??
    const line = Line.create({ text: lineText, artId: id, userId: 4 });
    try {
      await line.save();
      return line;
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  // Delete line for story
  async deleteLine(request: Request, response: Response) {
    const lineId = parseInt(request.params.lineId);
    try {
      const line = await Line.findOne({ where: { id: lineId } });
      await line.remove();
      response.status(204);
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }
}

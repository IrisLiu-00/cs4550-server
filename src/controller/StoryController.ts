import axios from 'axios';
import { Request, Response } from 'express';
import { Line } from '../entity/Line';
import { StoryDetail, StorySummary, UserRole } from '../types';
import { StoryService } from './StoryService';
import { Feature } from '../entity/Feature';

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
    if (isNaN(userId)) {
      response.status(400);
      return;
    }
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

  // Get most recent stories for team /stories/recent/team/:id
  async getFeaturesForTeam(request: Request, response: Response): Promise<StorySummary[]> {
    const teamId = request.params.id;
    try {
      const lineData = await Line.createQueryBuilder('line')
        .select('line.artId', 'artId')
        .addSelect('COUNT(*)', 'length')
        .addSelect('MAX(line.timestamp)', 'updatedAt')
        .innerJoin('line.user', 'user')
        .innerJoin(Feature, 'feature', 'line.artId = feature.artId')
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

  // Get details for one story
  async get(request: Request, response: Response): Promise<StoryDetail> {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      response.status(400);
      return;
    }

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
      const features = await Feature.find({ where: { artId: id }, relations: ['team'] });
      data.featured = features.map((f) => f.team.id);
      return data;
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  // Post new line for story
  async postLine(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      response.status(400);
      return;
    }
    if (request.session['profile']?.id === undefined) {
      response.status(401);
      return 'Must be logged in';
    }
    const { lineText } = request.body;
    const line = Line.create({ text: lineText, artId: id, userId: request.session['profile']?.id });
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
    if (isNaN(lineId)) {
      response.status(400);
      return;
    }
    if (request.session['profile']?.role !== UserRole.LEADER) {
      response.status(401);
      return 'Must be a team leader';
    }

    try {
      const line = await Line.findOne({ where: { id: lineId } });
      await line.remove();
      response.status(204);
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  async toggleFeature(request: Request, response: Response) {
    const id = parseInt(request.params.id);
    if (isNaN(id)) {
      response.status(400);
      return;
    }
    if (request.session['profile']?.role !== UserRole.LEADER) {
      response.status(401);
      return 'Must be a team leader';
    }

    const { teamId } = request.body;
    const feature = await Feature.findOne({ where: { teamId, artId: id } });
    try {
      if (feature) {
        await feature.remove();
      } else {
        await Feature.create({ artId: id, teamId }).save();
      }
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }
}

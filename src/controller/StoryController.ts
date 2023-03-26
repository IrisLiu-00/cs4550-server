import axios from 'axios';
import { Request, Response } from 'express';
import { Line } from '../entity/Line';
import { StoryDetail } from '../types';

export class StoryController {
  // Get stories matching search

  // Get most recent active stories, globally

  // Get logged in user's most recent stories

  // Get most recent stories for team

  // Get featured stories for team

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
        select: { text: true, timestamp: true, user: { id: true, teamId: true, displayName: true } },
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
    const line = Line.create({ text: lineText, artId: id, userId: 2 });
    try {
      await line.save();
      return line;
    } catch (err) {
      console.log(err);
      response.status(400);
    }
  }

  // Delete line for story
}

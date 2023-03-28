import axios from 'axios';
import { request } from 'http';
import { StorySummary } from '../types';

type LineData = {
  artId: number;
  length: number;
  updatedAt: Date;
};

export class StoryService {
  async getArtBySearch(criteria: string) {
    const resp = await axios.get(
      `https://api.artic.edu/api/v1/artworks/search?q=${criteria}&query[term][is_public_domain]=true&fields=id,image_id,thumbnail,title`
    );
    return resp.data.data;
  }

  async getArtByIds(ids: number[]) {
    const resp = await axios.get(
      `https://api.artic.edu/api/v1/artworks?ids=${ids.join(
        ','
      )}&query[term][is_public_domain]=true&fields=id,image_id,thumbnail,title`
    );
    return resp.data.data;
  }

  async formatStorySummaries(rawData: StorySummary[], lineData: LineData[]) {
    const lineDict = {};
    lineData.forEach((data) => (lineDict[data.artId] = { ...data }));
    rawData.forEach((story: StorySummary) => {
      story.imageUrl = `https://www.artic.edu/iiif/2/${story.image_id}/full/843,/0/default.jpg`;
      story.length = lineDict[story.id]?.length || 0;
      story.updatedAt = lineDict[story.id]?.updatedAt || null;
    });
    return rawData;
  }
}

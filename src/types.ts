export enum UserRole {
  LEADER = 'LEADER',
  WRITER = 'WRITER',
}

export type UserPartial = {
  id: number;
  teamId: string;
  displayName: string;
};

export interface User extends UserPartial {
  role: UserRole;
  email: string;
  password: string;
}

export type Line = {
  id: number;
  text: string;
  timestamp: Date;
  user: UserPartial;
};

export type StoryPartial = {
  id: number;
  image_id: string;
  imageUrl: string;
  title: string;
  thumbnail: { alt_text: string };
};

export interface StorySummary extends StoryPartial {
  updatedAt: Date;
  length: number;
}

export interface StoryDetail extends StoryPartial {
  artist_display: string;
  date_display: string;
  lines: Line[];
  featured: string[];
}

export type TeamSummary = {
  id: string;
  color: string;
  description: string;
  score: number;
  leadId: number;
};

export type TeamDetail = {
  id: string;
  color: string;
  description: string;
  score: number;
  leadId: number;
  members: UserPartial[];
};

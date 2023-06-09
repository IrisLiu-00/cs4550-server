import { Entity, BaseEntity, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { Team } from './Team';

// Join table for many-to-many relationship between teams and featured artworks
@Entity()
export class Feature extends BaseEntity {
  @PrimaryColumn()
  artId: number;

  @PrimaryColumn()
  teamId: string;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'teamId' })
  team: Team;
}

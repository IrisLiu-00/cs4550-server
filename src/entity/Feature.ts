import { Entity, BaseEntity, JoinColumn, PrimaryColumn, ManyToOne } from 'typeorm';
import { Team } from './Team';

// Join table for many-to-many relationship between teams and featured artworks
@Entity()
export class Feature extends BaseEntity {
  @PrimaryColumn()
  artId: number;

  @PrimaryColumn()
  teamId: number;

  @ManyToOne(() => Team)
  @JoinColumn({ name: 'leadId' })
  team: Team;
}

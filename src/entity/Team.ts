import { Entity, Column, BaseEntity, PrimaryColumn, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Feature } from './Feature';
import { User } from './User';

@Entity()
export class Team extends BaseEntity {
  @PrimaryColumn({ type: 'varchar', length: 128 })
  id: string;

  @Column({ type: 'varchar', length: 7 })
  color: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({ nullable: true })
  leadId: number;

  @OneToOne(() => User, { cascade: ['remove'] })
  @JoinColumn({ name: 'leadId' })
  lead: User;

  @OneToMany((type) => User, (user) => user.teamId, { onDelete: 'CASCADE' })
  members: User[];

  @OneToMany((type) => Feature, (feature) => feature.teamId)
  features: Feature[];
}

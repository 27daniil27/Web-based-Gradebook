import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column } from 'typeorm';
import { SubjectProgramItem } from './subject-program-item.entity';
import { LabTeamMember } from './lab-team-member.entity';

@Entity('lab_teams')
export class LabTeam {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => SubjectProgramItem, (p) => p.teams)
  programItem: SubjectProgramItem;

  @Column()
  programItemId: number;

  @Column({ type: 'text', nullable: true })
  name: string | null;

  @OneToMany(() => LabTeamMember, (m) => m.team, { cascade: true })
  members: LabTeamMember[];
}

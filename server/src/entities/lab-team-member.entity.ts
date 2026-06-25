import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, Unique } from 'typeorm';
import { LabTeam } from './lab-team.entity';
import { User } from './user.entity';

@Entity('lab_team_members')
@Unique(['teamId', 'studentId'])
export class LabTeamMember {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LabTeam, (t) => t.members, { onDelete: 'CASCADE' })
  team: LabTeam;

  @Column()
  teamId: number;

  @ManyToOne(() => User, (u) => u.teamMemberships)
  student: User;

  @Column()
  studentId: number;
}

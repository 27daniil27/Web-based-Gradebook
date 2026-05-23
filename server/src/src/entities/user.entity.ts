import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    full_name?: string;

    @Column()
    role: string;

    @Column()
    created_at: Date;
}
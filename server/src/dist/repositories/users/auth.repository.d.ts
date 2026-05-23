import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
export declare class AuthRepository {
    private readonly usersRepository;
    constructor(usersRepository: Repository<User>);
    findById(id: number): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    createUser(data: Partial<User>): Promise<User>;
    deleteById(id: number): Promise<void>;
}

import { AuthRepository } from '../../repositories/users/auth.repository';
import { User } from '../../entities/user.entity';
export declare class AuthService {
    private readonly authRepo;
    constructor(authRepo: AuthRepository);
    getHelloWithId(id: number): Promise<User | null>;
    register(dto: Partial<User>): Promise<User>;
}

import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../../repositories/users/auth.repository';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private readonly authRepo: AuthRepository) {}

  getHelloWithId(id: number) {
    return this.authRepo.findById(id);
  }

  async register(dto: Partial<User>) {
    return this.authRepo.createUser(dto);
  }
}
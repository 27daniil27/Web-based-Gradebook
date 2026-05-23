import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';

@Injectable()
export class AuthRepository {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  findById(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  createUser(data: Partial<User>): Promise<User> {
    const user = this.usersRepository.create({
      ...data,
      role: data.role ?? 'user',
      created_at: data.created_at ?? new Date(),
    });

    return this.usersRepository.save(user);
  }

  async deleteById(id: number) {
    await this.usersRepository.delete(id);
  }
}

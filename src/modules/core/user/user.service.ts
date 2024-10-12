import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { USER_REPOSITORY } from './user.constants';
import { UpdateUserDto } from './dto/update_user.dto';
import { EncryptionService } from '../../encryption/encryption.service';
import { CreateUserDto } from '../common/dtos/create_user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: Repository<User>,
    @Inject()
    private readonly encryptionService: EncryptionService,
  ) {}

  async getUsers(): Promise<Array<User>> {
    return this.userRepository.find();
  }
  async getUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: { id },
      relations: ['stores'],
    });
  }
  async getUserByProperties(userProperties: Partial<User>): Promise<User> {
    return this.userRepository.findOneBy(userProperties);
  }
  async getUserCredentialsByProperties(
    userProperties: Partial<User> | Partial<User>[],
  ): Promise<User> {
    return this.userRepository.findOne({
      select: ['id', 'email', 'name', 'password'],
      where: userProperties,
    });
  }

  async createUser(user: CreateUserDto) {
    await this.checkIfCredentialExist(user);
    const hashedPassword = await this.encryptionService.hashValue(
      user.password,
    );
    await this.userRepository.save({ ...user, password: hashedPassword });
  }

  async updateUser(userId: number, user: UpdateUserDto) {
    await this.checkIfCredentialExist(user);
    await this.userRepository.update({ id: userId }, user);
  }
  async updateUserPassword(userId: number, password: string) {
    const hashedPassword = await this.encryptionService.hashValue(password);
    await this.userRepository.update(
      { id: userId },
      { password: hashedPassword },
    );
  }

  async deleteUser(userId: number) {
    await this.userRepository.delete(userId);
  }

  async checkIfCredentialExist(requestBody: { email: string; name: string }) {
    const existingUser = await this.userRepository.findOneBy([
      { name: requestBody.name },
      { email: requestBody.email },
    ]);

    if (existingUser && existingUser.email === requestBody.email) {
      throw new HttpException(
        'User with this email already exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (existingUser && existingUser.name === requestBody.name) {
      throw new HttpException(
        'User with this name already exists',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

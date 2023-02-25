import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hashSync } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const isExist = this.userRepository.findOne({
        where: { username: createUserDto.username },
      });

      if (isExist) {
        throw new HttpException('User Already exists', HttpStatus.BAD_REQUEST);
      }

      const user = new User();
      user.username = createUserDto.username;
      user.password = hashSync(createUserDto.password, 10);

      return this.userRepository.save(user);
    } catch (error) {
      return error;
    }
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

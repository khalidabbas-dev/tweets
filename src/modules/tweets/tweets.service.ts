import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IUserContext from '../auth/interfaces/user-context.interface';
import type { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Tweet } from './entities/tweet.entity';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweet)
    private tweetRepository: Repository<Tweet>,

    private userService: UsersService,
  ) {}

  async create(
    createTweetDto: CreateTweetDto,
    user: IUserContext,
  ): Promise<Tweet> {
    const existingUser = await this.userService.findOne(user.username);
    if (!existingUser) {
      throw new NotFoundException('User does not exists');
    }
    const tweet = new Tweet();
    tweet.content = createTweetDto.content;
    tweet.user = existingUser;
    return this.tweetRepository.save(tweet);
  }

  async findAllByUser(user: IUserContext): Promise<Tweet[]> {
    return await this.tweetRepository.find({
      where: { user: { id: user.id } },
    });
  }

  async findOne(id: number): Promise<Tweet> {
    return await this.tweetRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTweetDto: UpdateTweetDto): Promise<Tweet> {
    const tweet = await this.findOne(id);

    if (!tweet) {
      throw new NotFoundException('Tweet does not exist!');
    }

    tweet.content = updateTweetDto.content;
    return await this.tweetRepository.save(tweet);
  }

  async remove(id: number): Promise<Tweet> {
    const tweet = await this.findOne(id);

    if (!tweet) {
      throw new NotFoundException('Tweet does not exist!');
    }
    return await this.tweetRepository.remove(tweet);
  }
}

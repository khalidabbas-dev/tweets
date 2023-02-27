import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import IUserContext from '../auth/interfaces/user-context.interface';
import { UsersService } from '../users/users.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { Tweet } from './entities/tweet.entity';
import { TweetsService } from './tweets.service';

describe('TweetsService', () => {
  let tweetsService: TweetsService;
  let userService: DeepMocked<UsersService>;
  let tweetRepo: DeepMocked<Repository<Tweet>>;

  const mockUserContext: IUserContext = {
    id: 1,
    username: 'testuser',
  };

  const mockTweet = {
    id: 1,
    content: 'Test tweet',
    user: {
      id: 1,
      username: 'testuser',
      password: 'testPass',
      tweets: [],
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TweetsService,
        {
          provide: getRepositoryToken(Tweet),
          useValue: createMock<Repository<Tweet>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    tweetsService = module.get<TweetsService>(TweetsService);
    userService = module.get(UsersService);
    tweetRepo = module.get(getRepositoryToken(Tweet));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    tweetRepo;
    expect(tweetsService).toBeDefined();
  });

  describe('create', () => {
    it('should create a tweet successfully', async () => {
      const createTweetDto: CreateTweetDto = {
        content: 'Test tweet',
      };
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'testPass',
        tweets: [],
      };
      userService.findOne.mockResolvedValue(mockUser);
      tweetRepo.save.mockResolvedValue({
        id: 1,
        ...createTweetDto,
        user: mockUser,
      });

      const result = await tweetsService.create(
        createTweetDto,
        mockUserContext,
      );

      expect(userService.findOne).toHaveBeenCalledWith(
        mockUserContext.username,
      );
      expect(tweetRepo.save).toHaveBeenCalledWith(expect.any(Tweet));
      expect(result).toEqual({ id: 1, ...createTweetDto, user: mockUser });
    });

    it('should throw a NotFoundException if user does not exist', async () => {
      const createTweetDto: CreateTweetDto = {
        content: 'Test tweet',
      };
      userService.findOne.mockResolvedValue(null);

      await expect(
        tweetsService.create(createTweetDto, mockUserContext),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAllByUser', () => {
    it('should return an array of tweets belonging to a user', async () => {
      const mockTweets = [
        {
          id: 1,
          content: 'Test tweet 1',
          user: {
            id: 1,
            username: 'testuser',
            password: 'testPass',
            tweets: [],
          },
        },
        {
          id: 2,
          content: 'Test tweet 2',
          user: {
            id: 1,
            username: 'testuser',
            password: 'testPass',
            tweets: [],
          },
        },
      ];
      tweetRepo.find.mockResolvedValue(mockTweets);

      const result = await tweetsService.findAllByUser(mockUserContext);

      expect(tweetRepo.find).toHaveBeenCalledWith({
        where: { user: { id: mockUserContext.id } },
      });
      expect(result).toEqual(mockTweets);
    });
  });
  describe('findOne', () => {
    it('should return a tweet by id', async () => {
      tweetRepo.findOne.mockResolvedValue(mockTweet);

      const result = await tweetsService.findOne(1);

      expect(tweetRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockTweet);
    });
    it('should return null if tweet does not exist', async () => {
      tweetRepo.findOne.mockResolvedValue(null);

      const result = await tweetsService.findOne(1);

      expect(tweetRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update a tweet by id', async () => {
      const updateTweetDto: UpdateTweetDto = {
        content: 'Updated tweet',
      };

      tweetRepo.findOne.mockResolvedValue(mockTweet);
      tweetRepo.save.mockResolvedValue({
        id: 1,
        ...mockTweet,
        ...updateTweetDto,
      });

      const result = await tweetsService.update(1, updateTweetDto);

      expect(tweetRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(tweetRepo.save).toHaveBeenCalledWith({
        ...mockTweet,
        ...updateTweetDto,
      });
      expect(result).toEqual({ id: 1, ...mockTweet, ...updateTweetDto });
    });

    it('should throw a NotFoundException if tweet does not exist', async () => {
      const updateTweetDto: UpdateTweetDto = {
        content: 'Updated tweet',
      };
      tweetRepo.findOne.mockResolvedValue(null);

      await expect(tweetsService.update(1, updateTweetDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a tweet by id', async () => {
      tweetRepo.findOne.mockResolvedValue(mockTweet);
      tweetRepo.remove.mockResolvedValue(mockTweet);

      const result = await tweetsService.remove(1);

      expect(tweetRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(tweetRepo.remove).toHaveBeenCalledWith(mockTweet);
      expect(result).toEqual(mockTweet);
    });

    it('should throw a NotFoundException if tweet does not exist', async () => {
      tweetRepo.findOne.mockResolvedValue(null);

      await expect(tweetsService.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});

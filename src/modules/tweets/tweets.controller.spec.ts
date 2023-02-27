import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { rejects } from 'assert';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';

describe('TweetsController', () => {
  let controller: TweetsController;
  let tweetsService: DeepMocked<TweetsService>;

  const user = {
    id: 1,
    username: 'testuser',
    password: 'testPassword',
    tweets: [],
  };

  const tweet = {
    id: 1,
    content: 'Hello, world!',
    user,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TweetsController],
    })
      .useMocker(createMock)
      .compile();

    controller = module.get<TweetsController>(TweetsController);
    tweetsService = module.get(TweetsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createTweetDto: CreateTweetDto = { content: 'Hello, world!' };

    it('should create a tweet and return it', async () => {
      const tweet = { id: 1, content: 'Hello, world!', user };
      tweetsService.create.mockResolvedValue(tweet);

      const result = await controller.create(createTweetDto, user);

      expect(result).toEqual(tweet);
      expect(tweetsService.create).toHaveBeenCalledWith(createTweetDto, user);
    });

    it('should catch and return any errors thrown by TweetsService.create', async () => {
      const error = new Error('Something went wrong');
      tweetsService.create.mockRejectedValue(error);

      const result = await controller.create(createTweetDto, user);

      expect(result).toEqual(error);
      expect(tweetsService.create).toHaveBeenCalledWith(createTweetDto, user);
    });
  });

  describe('findAll', () => {
    it('should return an array of tweets belonging to the user', async () => {
      const tweets = [{ id: 1, content: 'Hello, world!', user }];
      tweetsService.findAllByUser.mockResolvedValue(tweets);

      const result = await controller.findAll(user);

      expect(result).toEqual(tweets);
      expect(tweetsService.findAllByUser).toHaveBeenCalledWith(user);
    });

    it('should catch and return any errors thrown by TweetsService.findAllByUser', async () => {
      const error = new Error('Something went wrong');
      tweetsService.findAllByUser.mockRejectedValue(error);

      const result = controller.findAll(user);

      expect(result).rejects.toEqual(error);
      expect(tweetsService.findAllByUser).toHaveBeenCalledWith(user);
    });
  });

  describe('findOne', () => {
    const id = 1;

    it('should return the tweet with the given id', async () => {
      jest.spyOn(tweetsService, 'findOne').mockResolvedValue(tweet);

      const result = await controller.findOne(id);

      expect(result).toEqual(tweet);
      expect(tweetsService.findOne).toHaveBeenCalledWith(id);
    });

    it('should catch and return any errors thrown by TweetsService.findOne', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(tweetsService, 'findOne').mockRejectedValue(error);

      const result = controller.findOne(id);

      expect(result).rejects.toEqual(error);
      expect(tweetsService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    const id = 1;
    const updateTweetDto: UpdateTweetDto = { content: 'Updated tweet content' };

    it('should update the tweet with the given id and return it', async () => {
      const tweet = {
        id,
        content: 'Updated tweet content',
        user,
      };
      jest.spyOn(tweetsService, 'update').mockResolvedValue(tweet);

      const result = await controller.update(id, updateTweetDto);

      expect(result).toEqual(tweet);
      expect(tweetsService.update).toHaveBeenCalledWith(id, updateTweetDto);
    });

    it('should catch and return any errors thrown by TweetsService.update', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(tweetsService, 'update').mockRejectedValue(error);

      const result = controller.update(id, updateTweetDto);

      expect(result).rejects.toEqual(error);
      expect(tweetsService.update).toHaveBeenCalledWith(id, updateTweetDto);
    });
  });

  describe('remove', () => {
    const id = 1;

    it('should delete the tweet with the given id and return it', async () => {
      jest.spyOn(tweetsService, 'remove').mockResolvedValue(tweet);

      const result = await controller.remove(id);

      expect(result).toEqual(tweet);
      expect(tweetsService.remove).toHaveBeenCalledWith(id);
    });

    it('should catch and return any errors thrown by TweetsService.remove', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(tweetsService, 'remove').mockRejectedValue(error);

      const result = controller.remove(id);

      expect(result).rejects.toEqual(error);
      expect(tweetsService.remove).toHaveBeenCalledWith(id);
    });
  });
});

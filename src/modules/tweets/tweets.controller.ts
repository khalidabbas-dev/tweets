import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { TweetsService } from './tweets.service';
import { CreateTweetDto } from './dto/create-tweet.dto';
import { UpdateTweetDto } from './dto/update-tweet.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import CurrentUser from '../auth/decorators/current-user.decorator';
import IUserContext from '../auth/interfaces/user-context.interface';

@Controller('tweets')
@UseGuards(JwtAuthGuard)
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @Post()
  async create(
    @Body() createTweetDto: CreateTweetDto,
    @CurrentUser() user: IUserContext,
  ) {
    try {
      return await this.tweetsService.create(createTweetDto, user);
    } catch (error) {
      return error;
    }
  }

  @Get()
  findAll(@CurrentUser() user: IUserContext) {
    try {
      return this.tweetsService.findAllByUser(user);
    } catch (error) {
      return error;
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    try {
      return this.tweetsService.findOne(id);
    } catch (error) {
      return error;
    }
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateTweetDto: UpdateTweetDto) {
    try {
      return this.tweetsService.update(id, updateTweetDto);
    } catch (error) {
      return error;
    }
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    try {
      return this.tweetsService.remove(id);
    } catch (error) {
      return error;
    }
  }
}

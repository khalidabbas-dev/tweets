import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import CurrentUser from '../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth-guard';
import IUserContext from '../auth/interfaces/user-context.interface';
import { AddBalanceDto } from './dto/add-balance.dto';
import { BuySharesDto } from './dto/buy-shares.dto';
import { SellSharesDto } from './dto/sell-shares.dto';
import { WalletsService } from './wallets.service';

@UseGuards(JwtAuthGuard)
@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletService: WalletsService) {}

  @Post('add-balance')
  async addBalance(
    @CurrentUser() user: IUserContext,
    @Body() dto: AddBalanceDto,
  ) {
    try {
      return await this.walletService.addBalance(user.id, dto.amount);
    } catch (error) {
      return error;
    }
  }

  @Post('buy-shares')
  async buyShares(
    @CurrentUser() user: IUserContext,
    @Body() dto: BuySharesDto,
  ) {
    return this.walletService.buyShares(user.id, dto.quantity, dto.price);
  }

  @Post('sell-shares')
  async sellShares(
    @CurrentUser() user: IUserContext,
    @Body() dto: SellSharesDto,
  ) {
    return this.walletService.sellShares(user.id, dto.quantity, dto.price);
  }

  @Get('rates')
  async getRates(@Param('userId') userId: number) {
    return { message: 'Live rates subscription initialized' };
  }
}

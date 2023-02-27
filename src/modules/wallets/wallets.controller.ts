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

  @Post('balance/add')
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

  @Post('shares/buy')
  async buyShares(
    @CurrentUser() user: IUserContext,
    @Body() dto: BuySharesDto,
  ) {
    return this.walletService.buyShares(user.id, dto.quantity, dto.price);
  }

  @Post('shares/sell')
  async sellShares(
    @CurrentUser() user: IUserContext,
    @Body() dto: SellSharesDto,
  ) {
    return this.walletService.sellShares(user.id, dto.quantity, dto.price);
  }

  @Get()
  async getWallet(@CurrentUser() user: IUserContext) {
    try {
      return await this.walletService.getUserWallet(user.id);
    } catch (error) {
      return error;
    }
  }
}

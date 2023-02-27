import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { Wallet } from './entities/wallet.entity';
import { EventsGateway } from './socket/websocket-gateway.socket';
import { WalletsController } from './wallets.controller';
import { WalletsService } from './wallets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet]), UsersModule],
  controllers: [WalletsController],
  providers: [WalletsService, UsersService, EventsGateway],
})
export class WalletsModule {}

import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Wallet } from './entities/wallet.entity';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    private userService: UsersService,
  ) {}

  async addBalance(userId: number, amount: number): Promise<Wallet> {
    try {
      let wallet = await this.walletRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!wallet) {
        return await this.createWallet(userId, amount);
      }

      wallet.balance += amount;
      const res = await this.walletRepository.save(wallet);

      return res;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async buyShares(
    userId: number,
    quantity: number,
    price: number,
  ): Promise<Wallet> {
    try {
      const totalCost = quantity * price;

      const wallet = await this.walletRepository.findOne({
        where: { user: { id: userId } },
      });

      if (!wallet) {
        throw new NotFoundException(
          'No wallet found for this user. Create one by adding some balance',
        );
      }

      if (wallet.balance < totalCost) {
        throw new HttpException(
          'Insufficient funds',
          HttpStatus.PRECONDITION_FAILED,
        );
      }
      wallet.balance -= totalCost;

      // TODO: perform actual transaction
      return await this.walletRepository.save(wallet);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async sellShares(
    userId: number,
    quantity: number,
    price: number,
  ): Promise<Wallet> {
    try {
      let wallet = await this.walletRepository.findOne({
        where: { user: { id: userId } },
      });

      const totalValue = quantity * price;

      if (!wallet) {
        return await this.createWallet(userId, totalValue);
      }

      wallet.balance += totalValue;

      // TODO: perform actual transaction
      return await this.walletRepository.save(wallet);
    } catch (error) {
      return error;
    }
  }

  async createWallet(userId: number, amount: number): Promise<Wallet> {
    try {
      const wallet = new Wallet();
      const user = await this.userService.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found for wallet');
      }

      wallet.user = user;
      wallet.balance = amount;

      return await this.walletRepository.save(wallet);
    } catch (error) {
      return error;
    }
  }
}

import { IsNotEmpty, IsNumber, IsString, IsPositive } from 'class-validator';

export class AddBalanceDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  amount: number;
}

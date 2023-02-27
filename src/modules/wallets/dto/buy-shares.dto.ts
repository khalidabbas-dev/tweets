import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class BuySharesDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}

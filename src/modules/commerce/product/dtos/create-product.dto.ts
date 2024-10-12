import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  categories: Array<number>;
  @IsString()
  @IsNotEmpty()
  store_id: number;
}

import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @IsNumber()
  @IsNotEmpty()
  store_id: number;
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsArray()
  @IsOptional()
  categories?: Array<number>;
  @IsNumber()
  @IsOptional()
  quantity?: number;
}

import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsOptional()
  name?: string;
  @IsArray()
  @IsOptional()
  categories?: Array<number>;
  @IsNumber()
  @IsOptional()
  quantity?: number;
}

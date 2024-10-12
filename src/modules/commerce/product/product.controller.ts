import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProductService } from './product.service';
import { StoreOwnershipGuard } from '../guards/store_ownership.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { responseWriter } from 'src/utils/response_writer.util';

@Controller('products')
@UseGuards(AuthGuard)
export class ProductController {
  constructor(
    @Inject()
    private readonly productService: ProductService,
  ) {}

  @Get()
  async getProducts(
    @Res() res,
    @Query('store') storeId: number,
    @Query('category') categoryId: number,
  ) {
    const products = await this.productService.getProducts(storeId, categoryId);
    return responseWriter(
      res,
      HttpStatus.OK,
      'Products Retrieved Successfully',
      products,
    );
  }

  @Post()
  @UseGuards(StoreOwnershipGuard)
  async createProduct(@Body() createProduct: CreateProductDto) {
    return this.productService.createProduct(createProduct);
  }

  @Put(':id')
  @UseGuards(StoreOwnershipGuard)
  async updateProduct() {}

  @Get(':id')
  async getProductById(@Param('id') id: number) {
    return this.productService.getProductById(id);
  }
}

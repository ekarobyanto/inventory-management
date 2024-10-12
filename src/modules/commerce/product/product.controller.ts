import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { ProductService } from './product.service';
import { StoreOwnershipGuard } from '../guards/store_ownership.guard';
import { CreateProductDto } from './dtos/create-product.dto';
import { responseWriter } from 'src/utils/response_writer.util';
import { ProductNameAlreadyExist } from './guards/product-name-already-exist.guard';
import { CategoriesInStoreGuard } from '../guards/categories-in-store.guard';

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
    @Query('storeId') storeId: number,
    @Query('categoryId') categoryId: number,
  ) {
    const products = await this.productService.getProducts(storeId, categoryId);
    return responseWriter(
      res,
      HttpStatus.OK,
      'Products Retrieved Successfully',
      products,
    );
  }
  @Get(':productId')
  async getProductById(@Res() res, @Param('productId') productId: number) {
    const products = await this.productService.getProductById(productId);
    return responseWriter(
      res,
      HttpStatus.OK,
      'Products Retrieved Successfully',
      products,
    );
  }

  @Post()
  @UseGuards(
    StoreOwnershipGuard,
    CategoriesInStoreGuard,
    ProductNameAlreadyExist,
  )
  async createProduct(@Res() res, @Body() createProduct: CreateProductDto) {
    await this.productService.createProduct(createProduct);
    return responseWriter(res, HttpStatus.CREATED, 'Product created');
  }

  // @Put(':productId')
  // @UseGuards(StoreOwnershipGuard)
  // async updateProduct(@Param('productId') productId: number) {}

  // @Get(':productId')
  // async getProductById(@Param('productId') productId: number) {
  //   return this.productService.getProductById(productId);
  // }
}

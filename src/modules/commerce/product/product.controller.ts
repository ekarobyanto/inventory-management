import {
  Body,
  Controller,
  Delete,
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
import { ProductNameAlreadyExistGuard } from './guards/product-name-already-exist.guard';
import { CategoriesInStoreGuard } from '../guards/categories-in-store.guard';
import { ProductInStoreOwnershipGuard } from './guards/product-in-store-ownership.guard';
import { UpdateProductDto } from './dtos/update-product.dto';

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
    ProductNameAlreadyExistGuard,
  )
  async createProduct(@Res() res, @Body() createProduct: CreateProductDto) {
    await this.productService.createProduct(createProduct);
    return responseWriter(res, HttpStatus.CREATED, 'Product created');
  }

  @Put(':productId')
  @UseGuards(
    ProductInStoreOwnershipGuard,
    CategoriesInStoreGuard,
    ProductNameAlreadyExistGuard,
  )
  async updateProduct(
    @Res() res,
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    await this.productService.updateProduct(productId, updateProductDto);
    return responseWriter(res, HttpStatus.OK, 'Product updated');
  }

  @Delete(':productId')
  @UseGuards(ProductInStoreOwnershipGuard)
  async deleteProduct(@Res() res, @Param('productId') productId: number) {
    await this.productService.deleteProduct(productId);
    return responseWriter(res, HttpStatus.OK, 'Product deleted');
  }
}

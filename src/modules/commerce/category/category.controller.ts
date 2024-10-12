import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { responseWriter } from 'src/utils/response_writer.util';
import { StoreOwnershipGuard } from '../guards/store_ownership.guard';
import { CreateCategoryDto } from './dtos/create_category.dto';
import { Store } from '../store/store.entity';
import { UpdateCategoryDto } from './dtos/update-category.dto';
import { StoreCategoryGuard } from './guards/store_category.guard';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(
    @Inject()
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  async getCategories(@Res() res, @Query('store_id') storeId: number) {
    const categories = await this.categoryService.getCategories(storeId);
    if (categories.length === 0) {
      throw new HttpException('No categories found', HttpStatus.NOT_FOUND);
    }
    return responseWriter(
      res,
      HttpStatus.OK,
      'Categories Successfully retrieved',
      categories,
    );
  }

  @Get(':id')
  async getCategoryById(@Res() res, @Param('id') categoryId: number) {
    const category = await this.categoryService.getCategoryById(categoryId);
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
    return responseWriter(
      res,
      HttpStatus.OK,
      'Category Successfully retrieved',
      category,
    );
  }

  @Post()
  @UseGuards(StoreOwnershipGuard)
  async createCategory(
    @Res() res,
    @Req() req,
    @Body() category: CreateCategoryDto,
  ) {
    const store: Store = req.store;
    await this.categoryService.createCategory(category, store);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'Category created successfully',
    );
  }

  @Put(':categoryId')
  @UseGuards(StoreCategoryGuard)
  async updateCategory(
    @Res() res,
    @Param('categoryId') categoryId: number,
    @Body() categoryDto: UpdateCategoryDto,
  ) {
    await this.categoryService.updateCategory(categoryId, categoryDto);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'Category updated successfully',
    );
  }

  @Delete(':categoryId')
  @UseGuards(StoreCategoryGuard)
  async deleteCategory(@Res() res, @Param('categoryId') categoryId: number) {
    await this.categoryService.deleteCategory(categoryId);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'Category deleted successfully',
    );
  }
}

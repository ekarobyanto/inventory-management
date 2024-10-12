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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { responseWriter } from 'src/utils/response_writer.util';
import { StoreOwnershipGuard } from '../store/guards/store_ownership.guard';
import { CreateCategoryDto } from '../dtos/create_category.dto';
import { Store } from '../store/store.entity';

@Controller('categories')
@UseGuards(AuthGuard)
export class CategoryController {
  constructor(
    @Inject()
    private readonly categoryService: CategoryService,
  ) {}

  @Get()
  async getCategories(@Res() res) {
    const categories = await this.categoryService.getCategories();
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

  @Delete(':id')
  async deleteCategory(@Res() res, @Param('id') categoryId: number) {
    await this.categoryService.deleteCategory(categoryId);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'Category deleted successfully',
    );
  }
}

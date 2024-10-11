import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { responseWriter } from 'src/utils/response_writer.util';

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
    const categories = await this.categoryService.getCategoryById(categoryId);
    return responseWriter(
      res,
      HttpStatus.OK,
      'Category Successfully retrieved',
      categories,
    );
  }
}

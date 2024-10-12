import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from './category.constant';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from '../dtos/create_category.dto';
import { Store } from '../store/store.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories() {
    return this.categoryRepository.find();
  }

  async getCategoryById(categoryId: number) {
    return this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['store', 'products'],
    });
  }

  async getStoreCategories(storeId: number) {
    return this.categoryRepository.find({ where: { store: { id: storeId } } });
  }

  async createCategory(createCategory: CreateCategoryDto, store: Store) {
    await this.validateCategoryNameExist(createCategory);
    const category = this.categoryRepository.create({
      name: createCategory.name,
      store: store,
    });
    return this.categoryRepository.save(category);
  }

  async deleteCategory(categoryId: number) {
    await this.validateCategoryExist(categoryId);
    return await this.categoryRepository.delete(categoryId);
  }

  async validateCategoryNameExist(categoryDto: CreateCategoryDto) {
    const category = await this.categoryRepository.findOneBy({
      name: categoryDto.name,
      store: { id: categoryDto.store_id },
    });
    if (category) {
      throw new HttpException(
        'Category with this name already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async validateCategoryExist(id: number) {
    const category = this.getCategoryById(id);
    if (!category) {
      throw new HttpException(
        'Category does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }
    return category;
  }
}

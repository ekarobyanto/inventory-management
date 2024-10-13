import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from './category.constant';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dtos/create_category.dto';
import { Store } from '../store/store.entity';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async getCategories(storeId?: number) {
    return this.categoryRepository.find({ where: { store: { id: storeId } } });
  }

  async getCategoryById(categoryId: number) {
    return this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['store', 'products'],
    });
  }

  async getCategoryByUserId(userId: number, categoryId?: number) {
    const query = this.categoryRepository
      .createQueryBuilder('category')
      .innerJoin('category.store', 'store')
      .innerJoin('store.owner', 'user')
      .where('user.id = :userId', { userId });

    if (categoryId) {
      query.andWhere('category.id = :categoryId', { categoryId });
    }

    return await query.select(['category.id', 'category.name']).getMany();
  }

  async createCategory(createCategory: CreateCategoryDto, store: Store) {
    await this.validateCategoryNameExist(createCategory);
    const category = this.categoryRepository.create({
      name: createCategory.name,
      store: store,
    });
    return this.categoryRepository.save(category);
  }

  async updateCategory(categoryid: number, updateCategory: UpdateCategoryDto) {
    await this.categoryRepository.update({ id: categoryid }, updateCategory);
  }

  async deleteCategory(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: {
        products: true,
      },
    });
    category.products = [];
    await this.categoryRepository.save(category);
    await this.categoryRepository.delete({ id: categoryId });
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

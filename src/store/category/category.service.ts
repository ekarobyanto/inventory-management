import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from './category.constant';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: Repository<Category>,
  ) {}
}

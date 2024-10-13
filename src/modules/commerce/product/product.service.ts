import { Inject, Injectable } from '@nestjs/common';
import { PRODUCT_REPOSITORY } from './product.contant';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto } from './dtos/create-product.dto';
import { UpdateProductDto } from './dtos/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: Repository<Product>,
  ) {}

  async getProducts(storeId?: number, categoryId?: number) {
    return await this.productRepository.find({
      where: {
        store: { id: storeId },
        categories: { id: categoryId },
      },
    });
  }

  async getProductByNameInStore(storeId: number, name: string) {
    return await this.productRepository.findOne({
      where: { store: { id: storeId }, name },
    });
  }

  async getProductById(productId: number) {
    return await this.productRepository.findOne({
      where: { id: productId },
      relations: ['categories', 'store', 'store.owner'],
    });
  }

  async getProductsByStore(storeId: number) {
    return await this.productRepository.find({
      where: { store: { id: storeId } },
      relations: ['categories'],
    });
  }

  async getProductsByCategory(categoryId: number) {
    return await this.productRepository.find({
      where: { categories: { id: categoryId } },
      relations: ['categories'],
    });
  }

  async createProduct(createProduct: CreateProductDto) {
    const product = this.productRepository.create({
      name: createProduct.name,
      store: { id: createProduct.store_id },
      quantity: createProduct.quantity ?? 0,
      categories: createProduct.categories?.map((id) => ({ id })) ?? [],
    });
    return await this.productRepository.save(product);
  }

  async updateProduct(productId: number, updateProduct: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['categories'],
    });

    return await this.productRepository.save({
      ...product,
      ...updateProduct,
      categories:
        updateProduct?.categories?.map((id) => ({ id })) ?? product.categories,
    });
  }

  async deleteProduct(productId: number) {
    return await this.productRepository.delete({ id: productId });
  }
}

import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { STORE_REPOSITORY } from './store.constant';
import { Repository } from 'typeorm';
import { Store } from './store.entity';
import { CreateStoreDto } from './dtos/create_store.dto';

@Injectable()
export class StoreService {
  constructor(
    @Inject(STORE_REPOSITORY)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async getStores(): Promise<Array<Store>> {
    return this.storeRepository.find();
  }

  async getStoresByOwnerId(ownerId: number): Promise<Array<Store>> {
    return await this.storeRepository.find({
      where: { owner: { id: ownerId } },
    });
  }

  async getStoreById(storeId: number): Promise<Store> {
    return this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['owner', 'products', 'categories'],
    });
  }

  async getStoreByProperties(storeProperties: Partial<Store>): Promise<Store> {
    return this.storeRepository.findOneBy(storeProperties);
  }

  async createStore(storeDto: CreateStoreDto, userId: number) {
    await this.validateStoreCredentialExist(storeDto);
    const store = this.storeRepository.create({
      name: storeDto.name,
      owner: { id: userId },
    });
    return await this.storeRepository.save(store);
  }

  async updateStore(storeId: number, store: CreateStoreDto) {
    await this.validateStoreCredentialExist(store);
    return this.storeRepository.update({ id: storeId }, { ...store });
  }

  async deleteStore(storeId: number) {
    return await this.storeRepository.delete({ id: storeId });
  }

  async validateStoreCredentialExist(storeDto: CreateStoreDto) {
    const store = await this.getStoreByProperties({
      name: storeDto.name,
    });
    if (store) {
      throw new HttpException(
        'Store with this name already exist',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

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
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { StoreService } from './store.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { responseWriter } from 'src/utils/response_writer.util';
import { User } from 'src/modules/core/user/user.entity';
import { CreateStoreDto } from './dtos/create_store.dto';
import { StoreOwnershipGuard } from 'src/modules/commerce/guards/store_ownership.guard';

@Controller('stores')
@UseGuards(AuthGuard)
export class StoreController {
  constructor(
    @Inject()
    private readonly storeService: StoreService,
  ) {}

  @Get()
  async getStores(@Res() res) {
    const stores = await this.storeService.getStores();
    return responseWriter(
      res,
      HttpStatus.OK,
      'stores retrieved successfully',
      stores,
    );
  }

  @Get('/owner')
  async getOwnedStores(@Res() res, @Req() req) {
    const user: User = req.user;
    const stores = await this.storeService.getStoresByOwnerId(user.id);
    return responseWriter(
      res,
      HttpStatus.OK,
      'Stores retrieved successfully',
      stores,
    );
  }

  @Post()
  async createStore(@Res() res, @Req() req, @Body() reqBody: CreateStoreDto) {
    const user: User = req.user;
    await this.storeService.createStore(reqBody, user.id);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'store created successfully',
    );
  }

  @Get(':id')
  async getStoreById(@Res() res, @Param('id') id: number) {
    const store = await this.storeService.getStoreById(id);
    if (!store) {
      throw new HttpException('Store not found', HttpStatus.NOT_FOUND);
    }
    return responseWriter(
      res,
      HttpStatus.OK,
      'Store retrieved successfully',
      store,
    );
  }

  @Put(':storeId')
  @UseGuards(StoreOwnershipGuard)
  async updateStore(
    @Res() res,
    @Body() body: CreateStoreDto,
    @Param('storeId') id: number,
  ) {
    await this.storeService.updateStore(id, body);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'store updated successfully',
    );
  }

  @Delete(':storeId')
  @UseGuards(StoreOwnershipGuard)
  async deleteStore(@Res() res, @Param('storeId') id: number) {
    await this.storeService.deleteStore(id);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'store deleted successfully',
    );
  }
}

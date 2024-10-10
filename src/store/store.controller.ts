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
import { User } from 'src/core/user/user.entity';
import { CreateStoreDto } from './dtos/create_store.dto';

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
  async getStoresByOwner(@Res() res, @Req() req) {
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
  async createStore(@Res() res, @Body() reqBody: CreateStoreDto, @Req() req) {
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
      'store retrieved successfully',
      store,
    );
  }

  @Put(':id')
  async updateStore(
    @Res() res,
    @Req() req,
    @Body() reqBody: CreateStoreDto,
    @Param('id') id: number,
  ) {
    const user: User = req.user;
    await this.storeService.updateStore(id, user.id, reqBody);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'store updated successfully',
    );
  }
  @Delete(':id')
  async deleteStore(@Res() res, @Req() req, @Param('id') id: number) {
    const user: User = req.user;
    await this.storeService.deleteStore(id, user.id);
    return responseWriter(
      res,
      HttpStatus.CREATED,
      'store deleted successfully',
    );
  }
}

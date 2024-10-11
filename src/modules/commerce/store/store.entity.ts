import { User } from 'src/modules/core/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Category } from 'src/modules/commerce/category/category.entity';
import { Product } from 'src/modules/commerce/product/product.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  name: string;
  @JoinColumn({ name: 'owner_id' })
  @ManyToOne(() => User, (user) => user.stores)
  owner: User;
  @OneToMany(() => Category, (category) => category.store, {
    onDelete: 'CASCADE',
  })
  categories: Array<Category>;
  @OneToMany(() => Product, (product) => product.store, { onDelete: 'CASCADE' })
  products: Array<Product>;
}

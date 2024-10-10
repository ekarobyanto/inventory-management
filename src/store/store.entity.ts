import { User } from 'src/core/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './category/category.entity';
import { Product } from './product/product.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;
  @JoinColumn({ name: 'owner_id' })
  @Column({ unique: true })
  name: string;
  @ManyToOne(() => User, (user) => user.stores)
  owner: User;
  @OneToMany(() => Category, (category) => category.id, { onDelete: 'CASCADE' })
  categories: Array<Category>;
  @OneToMany(() => Product, (product) => product.store, { onDelete: 'CASCADE' })
  products: Array<Product>;
}

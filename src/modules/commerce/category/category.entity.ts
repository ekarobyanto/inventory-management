import { Product } from 'src/modules/commerce/product/product.entity';
import { Store } from 'src/modules/commerce/store/store.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @JoinColumn({ name: 'store_id' })
  @ManyToOne(() => Store, (store) => store.categories)
  store: Store;
  @ManyToMany(() => Product, (product) => product.categories)
  products: Array<Product>;
}

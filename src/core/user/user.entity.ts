import { Store } from 'src/store/store.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  email: string;
  @Column()
  name: string;
  @Column({ select: false })
  password: string;
  @OneToMany(() => Store, (store) => store.owner, { onDelete: 'CASCADE' })
  stores: Array<Store>;
}

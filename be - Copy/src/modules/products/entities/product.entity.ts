import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Inventory } from 'src/modules/inventory/entities/inventory.entity';

@Entity('san_pham')
export class Product {
  @PrimaryGeneratedColumn()
  id_san_pham: number;

  @Column({ length: 255 })
  ten_san_pham: string;

  @Column('text')
  mo_ta: string;

  @Column('decimal', { precision: 10, scale: 2 })
  gia: number;

  @Column({ length: 255 })
  hinh_anh: string;

  @Column({ length: 50, nullable: true })
  mau_sac: string;

  @Column({ length: 100, nullable: true })
  chat_lieu: string;

  @Column({ default: 0 })
  so_luong: number;

  @Column({ length: 10, nullable: true })
  size: string;

  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'id_danh_muc' })
  category: Category;

  @Column()
  id_danh_muc: number;

  // LIÊN KẾT TỚI LÔ KHO
  @ManyToOne(() => Inventory, (inventory) => inventory.products)
  @JoinColumn({ name: 'id_kho' })
  kho: Inventory;

  @Column()
  id_kho: number;
}

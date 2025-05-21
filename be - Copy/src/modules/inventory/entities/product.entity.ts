// src/modules/products/entities/product.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inventory } from '../../inventory/entities/inventory.entity';

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

  @Column({ type: 'int' })
  id_danh_muc: number;

  @Column({ type: 'int' })
  id_kho: number;

  @ManyToOne(() => Inventory, (inventory) => inventory.products)
  @JoinColumn({ name: 'id_kho' })
  kho: Inventory;
}

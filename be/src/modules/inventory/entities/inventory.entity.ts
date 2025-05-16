// src/modules/inventory/entities/inventory.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

export enum TrangThaiKho {
  CON_HANG = 'con_hang',
  HET_HANG = 'het_hang',
  SAP_HET = 'sap_het',
}

@Entity('quan_ly_kho')
export class Inventory {
  @PrimaryGeneratedColumn()
  id_kho: number;

  @Column({ length: 255 })
  nha_cung_cap: string;

  @Column('decimal', { precision: 10, scale: 2 })
  gia_nhap: number;

  @Column()
  so_luong: number;

  @Column({ length: 10, nullable: true })
  size: string;

  @Column({ length: 100, nullable: true })
  chat_lieu: string;

  @Column({ length: 50, nullable: true })
  mau_sac: string;

  @Column({ type: 'enum', enum: TrangThaiKho, default: TrangThaiKho.CON_HANG })
  trang_thai: TrangThaiKho;

  @OneToOne(() => Product, (product) => product.category)
  @JoinColumn({ name: 'id_san_pham' })
  product: Product;
}

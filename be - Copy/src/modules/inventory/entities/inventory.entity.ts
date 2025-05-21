import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
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
  ten_hang_hoa: string;

  @Column({ length: 255 })
  nha_cung_cap: string;

  @Column('decimal', { precision: 10, scale: 2 })
  gia_nhap: number;

  @Column({ type: 'int', default: 0 })
  so_luong: number;

  @Column({ length: 10, nullable: true })
  size: string;

  @Column({ length: 100, nullable: true })
  chat_lieu: string;

  @Column({ length: 50, nullable: true })
  mau_sac: string;

  @Column({ type: 'enum', enum: TrangThaiKho, default: TrangThaiKho.CON_HANG })
  trang_thai: TrangThaiKho;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  // Optional: Xem các sản phẩm đã bán ra từ lô này
  @OneToMany(() => Product, (product) => product.kho)
  products: Product[];
}

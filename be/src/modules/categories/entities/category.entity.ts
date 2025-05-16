// src/modules/category/entities/danhmuc.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('danh_muc')
export class DanhMuc {
  @PrimaryGeneratedColumn()
  id_danh_muc: number;

  @Column({ length: 100 })
  ten_danh_muc: string;

  @ManyToOne(() => DanhMuc, (dm) => dm.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: DanhMuc;

  @OneToMany(() => DanhMuc, (dm) => dm.parent)
  children?: DanhMuc[];

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}

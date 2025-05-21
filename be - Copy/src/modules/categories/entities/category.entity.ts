import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('danh_muc')
export class Category {
  @PrimaryGeneratedColumn({ name: 'id_danh_muc' })
  id: number;

  @Column({ name: 'ten_danh_muc', length: 100 })
  ten_danh_muc: string;

  @ManyToOne(() => Category, (category) => category.children, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent?: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @OneToMany(() => Product, (product) => product.category)
products: Product[];
}

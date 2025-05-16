import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('chi_tiet_don_hang')
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id_chi_tiet: number;

  @ManyToOne(() => Order, order => order.chi_tiet)
  @JoinColumn({ name: 'id_don_hang' })
  order: Order;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_san_pham' })
  product: Product;

  @Column()
  so_luong: number;

  @Column('decimal', { precision: 10, scale: 2 })
  don_gia: number;

  @Column({ length: 10 })
  kich_co: string;
}

import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('chi_tiet_gio_hang')
export class CartItem {
  @PrimaryGeneratedColumn()
  id_chi_tiet: number;

  @ManyToOne(() => Cart, (cart) => cart.items)
  @JoinColumn({ name: 'id_gio_hang' })
  cart: Cart;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_san_pham' })
  product: Product;

  @Column()
  so_luong: number;

  @Column({ length: 10 })
  kich_co: string;
}

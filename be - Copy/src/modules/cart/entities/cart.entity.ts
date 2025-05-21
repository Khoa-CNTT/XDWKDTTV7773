import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { CartItem } from './cart-item.entity';

@Entity('gio_hang')
export class Cart {
  @PrimaryGeneratedColumn()
  id_gio_hang: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_nguoi_dung' })
  user: User;

  @Column({ type: 'datetime' })
  ngay_tao: Date;

  @OneToMany(() => CartItem, (item) => item.cart)
  items: CartItem[];
}
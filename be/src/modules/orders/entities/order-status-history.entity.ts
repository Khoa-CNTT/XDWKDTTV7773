import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@Entity('lich_su_trang_thai_don_hang')
export class OrderStatusHistory {
  @PrimaryGeneratedColumn()
  id_lich_su: number;

  @ManyToOne(() => Order, order => order.lich_su)
  @JoinColumn({ name: 'id_don_hang' })
  order: Order;

  @Column({ type: 'enum', enum: OrderStatus })
  trang_thai_moi: OrderStatus;

  @Column({ type: 'datetime' })
  thoi_gian_cap_nhat: Date;

  @Column({ type: 'text', nullable: true })
  ghi_chu: string;
}
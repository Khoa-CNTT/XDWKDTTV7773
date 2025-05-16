import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { PaymentMethod } from 'src/common/enums/payment-method.enum';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';

@Entity('thanh_toan')
export class Payment {
  @PrimaryGeneratedColumn()
  id_thanh_toan: number;

  @ManyToOne(() => Order)
  @JoinColumn({ name: 'id_don_hang' })
  order: Order;

  @Column({ type: 'enum', enum: PaymentMethod })
  phuong_thuc: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus })
  trang_thai: PaymentStatus;

  @Column({ type: 'datetime' })
  thoi_gian_tao: Date;

  @Column({ type: 'datetime' })
  thoi_gian_thanh_toan: Date;

  @Column({ length: 255 })
  ma_giao_dich: string;

  @Column('decimal', { precision: 10, scale: 2 })
  tong_tien: number;

  @Column({ type: 'text', nullable: true })
  ghi_chu: string;
}

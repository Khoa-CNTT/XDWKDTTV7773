import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { OrderDetail } from './order-detail.entity';
import { OrderStatusHistory } from './order-status-history.entity';
import { OrderStatus } from 'src/common/enums/order-status.enum';

@Entity('don_hang')
export class Order {
  @PrimaryGeneratedColumn()
  id_don_hang: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_nguoi_dung' })
  user: User;

  @Column('decimal', { precision: 10, scale: 2 })
  tong_tien: number;

  @Column({ type: 'enum', enum: OrderStatus })
  trang_thai: OrderStatus;

  @Column({ type: 'datetime' })
  ngay_dat: Date;

  @Column({ type: 'text' })
  dia_chi_giao: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
ma_giam_gia: string | null;


  @OneToMany(() => OrderDetail, detail => detail.order)
  chi_tiet: OrderDetail[];

  @OneToMany(() => OrderStatusHistory, history => history.order)
  lich_su: OrderStatusHistory[];
}
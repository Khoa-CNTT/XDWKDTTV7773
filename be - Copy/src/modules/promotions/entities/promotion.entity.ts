// src/modules/discounts/entities/discount.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ma_giam_gia')
export class Discount {
  @PrimaryGeneratedColumn()
  id_khuyen_mai: number;

  @Column({ length: 50 })
  ma_giam_gia: string;

  @Column({ length: 255 })
  dieu_kien_su_dung: string;

  @Column('int')
  so_luong: number;

  @Column({ type: 'timestamp' })
  han_su_dung: Date;
}

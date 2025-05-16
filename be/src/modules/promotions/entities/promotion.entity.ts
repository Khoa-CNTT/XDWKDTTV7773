import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { DiscountType } from 'src/common/enums/discount-type.enum';

@Entity('khuyen_mai')
export class Promotion {
  @PrimaryGeneratedColumn()
  id_khuyen_mai: number;

  @Column({ length: 255 })
  ten_khuyen_mai: string;

  @Column({ length: 50 })
  ma_giam_gia: string;

  @Column()
  gia_tri: number;

  @Column({ type: 'enum', enum: DiscountType })
  loai: DiscountType;

  @Column({ type: 'datetime' })
  ngay_bat_dau: Date;

  @Column({ type: 'datetime' })
  ngay_ket_thuc: Date;
}

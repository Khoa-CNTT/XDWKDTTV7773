import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';

@Entity('thong_ke_ban_hang')
export class Statistic {
  @PrimaryGeneratedColumn()
  id_thong_ke: number;

  @Column({ type: 'date' })
  ngay_thong_ke: Date;

  @Column()
  tong_don_hang: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  tong_doanh_thu: number;

  @Column()
  so_san_pham_ban: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'id_danh_muc' })
  category: Category;
}

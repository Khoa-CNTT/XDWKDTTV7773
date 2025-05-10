import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nguoi_dung')
export class User {
  @PrimaryGeneratedColumn()
  id_nguoidung: number;

  @Column()
  ho_ten: string;

  @Column({ unique: true })
  email: string;

  @Column()
  so_dien_thoai: string;

  @Column({ type: 'text' })
  dia_chi: string;

  @Column({ type: 'enum', enum: ['khach_hang', 'nhan_vien', 'quan_ly'] })
  vai_tro: string;

  @Column({ default: true })
  trang_thai: boolean;
}

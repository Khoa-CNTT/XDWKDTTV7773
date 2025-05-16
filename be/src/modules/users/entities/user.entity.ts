import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('nguoi_dung')
export class User {
  @PrimaryGeneratedColumn()
  id_nguoidung: number;

  @Column({ length: 50 })
  ho_ten: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ select: true })
  password: string;

  @Column({ nullable: true })
  so_dien_thoai?: string;

  @Column({ nullable: true })
  dia_chi?: string;

  @Column({ type: 'enum', enum: ['khach_hang', 'nhan_vien', 'quan_ly'] })
  vai_tro: string;

  @Column({ default: true })
  trang_thai: boolean;

  @Column({ nullable: true })
  anh_dai_dien: string;
  

}

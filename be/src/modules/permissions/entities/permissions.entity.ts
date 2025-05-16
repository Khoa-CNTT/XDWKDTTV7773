// src/modules/permissions/entities/permission.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('phan_quyen')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ten_chuc_nang: string;

  @Column()
  vai_tro: string; // 'admin' | 'nhan_vien'

  @Column()
  ten_tai_khoan: string; // tên hoặc email người dùng
}

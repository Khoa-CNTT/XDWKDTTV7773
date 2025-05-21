// src/modules/auth/entities/otp.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('otp_requests')
export class OtpRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  otp: string;

  @Column()
  ho_ten: string;

  @Column()
  password: string;

  @Column()
  so_dien_thoai: string; // ➕ thêm dòng này

  @Column()
  dia_chi: string; // ➕ thêm dòng này

  @CreateDateColumn()
  created_at: Date;

  @Column()
  expires_at: Date;
}

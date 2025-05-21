import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('chat_ho_tro')
export class Chat {
  @PrimaryGeneratedColumn()
  id_tin_nhan: number;

  @Column({ type: 'int', nullable: false })
  id_nguoidung: number; // FK -> bảng nguoi_dung

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'id_nguoidung' }) // sửa lại tên đúng FK
  user: User;

  @Column('text')
  noi_dung: string;

  @Column({
    type: 'enum',
    enum: ['khach', 'bot', 'nhan_vien'],
  })
  nguoi_gui: 'khach' | 'bot' | 'nhan_vien';

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  thoi_gian: Date;

  @Column({
    type: 'enum',
    enum: ['dang_cho', 'da_tra_loi'],
    default: 'dang_cho',
  })
  trang_thai: 'dang_cho' | 'da_tra_loi';
}

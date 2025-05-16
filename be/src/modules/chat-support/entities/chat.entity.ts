import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('chat_ho_tro')
export class Chat {
  @PrimaryGeneratedColumn()
  id_tin_nhan: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'id_nguoi_dung' })
  user: User;

  @Column({ type: 'enum', enum: ['khach_hang'], default: 'khach_hang' })
  vai_tro_gui: 'khach_hang';

  @Column('text')
  noi_dung: string;

  @Column({ type: 'datetime' })
  thoi_gian_gui: Date;
}
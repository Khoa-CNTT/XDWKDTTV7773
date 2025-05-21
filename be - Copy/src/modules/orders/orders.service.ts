import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderDetail } from './entities/order-detail.entity';
import { OrderStatusHistory } from './entities/order-status-history.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class OrdersService {
  findByUser(id: number) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderDetail) private detailRepo: Repository<OrderDetail>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async create(dto: CreateOrderDto) {
    const user = await this.userRepo.findOne({ where: { id_nguoidung: dto.id_nguoi_dung } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    const order = this.orderRepo.create({
      user: user as User,
      tong_tien: dto.tong_tien,
      trang_thai: dto.trang_thai,
      dia_chi_giao: dto.dia_chi_giao,
      ngay_dat: dto.ngay_dat,
      ma_giam_gia: null,
    });
    const savedOrder = await this.orderRepo.save(order);

    const details = dto.chi_tiet.map(item =>
      this.detailRepo.create({
        order: savedOrder,
        product: { id_san_pham: item.id_san_pham } as Product,
        so_luong: item.so_luong,
        don_gia: item.don_gia,
        kich_co: item.kich_co,
      })
    );
    await this.detailRepo.save(details);

    return savedOrder;
  }

  async findAll() {
  return this.orderRepo.find({
    relations: [
      'user',
      'chi_tiet',
      'chi_tiet.product', // join luôn tên sản phẩm
      'lich_su',
    ],
    order: { ngay_dat: 'DESC' },
  });
}


  findOne(id: number) {
    return this.orderRepo.findOne({ where: { id_don_hang: id }, relations: ['user', 'chi_tiet', 'lich_su'] });
  }

  async update(id: number, dto: UpdateOrderDto) {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    Object.assign(order, dto);
    return this.orderRepo.save(order);
  }

  async remove(id: number) {
    const order = await this.findOne(id);
    if (!order) throw new NotFoundException('Không tìm thấy đơn hàng');
    return this.orderRepo.remove(order);
  }

  
}

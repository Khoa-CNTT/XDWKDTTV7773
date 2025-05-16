import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Order } from '../orders/entities/order.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  async create(dto: CreatePaymentDto) {
    const order = await this.orderRepo.findOne({ where: { id_don_hang: dto.id_don_hang } });
    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');

    const payment = this.paymentRepo.create({
      order,
      ...dto,
    });
    return this.paymentRepo.save(payment);
  }

  findAll() {
    return this.paymentRepo.find({ relations: ['order'] });
  }

  findOne(id: number) {
    return this.paymentRepo.findOne({ where: { id_thanh_toan: id }, relations: ['order'] });
  }
}
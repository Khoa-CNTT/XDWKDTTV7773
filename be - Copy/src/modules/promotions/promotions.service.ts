import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from './entities/promotion.entity';
import { CreateDiscountDto } from './dto/create-promotion.dto';
import { UpdateDiscountDto } from './dto/update-promotion.dto';

@Injectable()
export class DiscountsService {
  constructor(
    @InjectRepository(Discount)
    private discountRepo: Repository<Discount>
  ) {}

  findAll() {
    return this.discountRepo.find({ order: { han_su_dung: 'DESC' } });
  }

  findOne(id: number) {
    return this.discountRepo.findOneBy({ id_khuyen_mai: id });
  }

  async create(dto: CreateDiscountDto) {
    const discount = this.discountRepo.create(dto);
    return this.discountRepo.save(discount);
  }

  async update(id: number, dto: UpdateDiscountDto) {
    const discount = await this.findOne(id);
    if (!discount) throw new NotFoundException('Mã giảm giá không tồn tại');
    Object.assign(discount, dto);
    return this.discountRepo.save(discount);
  }

  async remove(id: number) {
    const discount = await this.findOne(id);
    if (!discount) throw new NotFoundException('Mã giảm giá không tồn tại');
    await this.discountRepo.remove(discount);
    return { message: 'Đã xóa mã giảm giá' };
  }
}

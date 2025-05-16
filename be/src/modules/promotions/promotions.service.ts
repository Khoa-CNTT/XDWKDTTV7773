import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './entities/promotion.entity';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(
    @InjectRepository(Promotion)
    private readonly promoRepo: Repository<Promotion>,
  ) {}

  create(dto: CreatePromotionDto) {
    const promo = this.promoRepo.create(dto);
    return this.promoRepo.save(promo);
  }

  findAll() {
    return this.promoRepo.find();
  }

  findOne(id: number) {
    return this.promoRepo.findOne({ where: { id_khuyen_mai: id } });
  }

  async update(id: number, dto: UpdatePromotionDto) {
    const promo = await this.findOne(id);
    if (!promo) throw new NotFoundException('Không tìm thấy khuyến mãi');
    Object.assign(promo, dto);
    return this.promoRepo.save(promo);
  }

  async remove(id: number) {
    const promo = await this.findOne(id);
    if (!promo) throw new NotFoundException('Không tìm thấy khuyến mãi');
    return this.promoRepo.remove(promo);
  }
}

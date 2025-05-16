// src/modules/inventory/inventory.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { Product } from '../products/entities/product.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async findAll() {
    const items = await this.inventoryRepo.find({ relations: ['product'] });
    return items.map((item) => ({
      id: item.id_kho,
      name: item.product?.ten_san_pham || 'Chưa có',
      supplier: item.nha_cung_cap,
      quantity: item.so_luong,
      price: item.gia_nhap,
      size: item.size,
      material: item.chat_lieu,
      color: item.mau_sac,
      status: item.trang_thai,
      productId: item.product?.id_san_pham,
    }));
  }

  async create(dto: CreateInventoryDto): Promise<Inventory> {
    const product = await this.productRepo.findOne({
      where: { id_san_pham: dto.id_san_pham },
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    const newItem = this.inventoryRepo.create({
      ...dto,
      product,
    });

    return await this.inventoryRepo.save(newItem);
  }

  async update(id: number, dto: UpdateInventoryDto): Promise<Inventory> {
    const item = await this.inventoryRepo.findOne({
      where: { id_kho: id },
      relations: ['product'],
    });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');

    Object.assign(item, dto);
    return this.inventoryRepo.save(item);
  }

  async findOne(id: number): Promise<Inventory> {
    const item = await this.inventoryRepo.findOne({
      where: { id_kho: id },
      relations: ['product'],
    });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    return item;
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.inventoryRepo.remove(item);
  }
}

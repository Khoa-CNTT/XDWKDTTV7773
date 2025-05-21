import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './entities/inventory.entity';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async findAll(): Promise<Inventory[]> {
    // relations: ['products'] nếu muốn lấy kèm các sản phẩm bán ra từ lô này
    return this.inventoryRepo.find();
  }

  async create(dto: CreateInventoryDto): Promise<Inventory> {
    const newItem = this.inventoryRepo.create(dto);
    return await this.inventoryRepo.save(newItem);
  }

  async update(id: number, dto: UpdateInventoryDto): Promise<Inventory> {
    const item = await this.inventoryRepo.findOne({ where: { id_kho: id } });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    Object.assign(item, dto);
    return this.inventoryRepo.save(item);
  }

  async findOne(id: number): Promise<Inventory> {
    const item = await this.inventoryRepo.findOne({ where: { id_kho: id } });
    if (!item) throw new NotFoundException('Không tìm thấy bản ghi');
    return item;
  }

  async remove(id: number): Promise<void> {
    const item = await this.findOne(id);
    await this.inventoryRepo.remove(item);
  }

  async getHistory() {
    const items = await this.inventoryRepo.find({
      order: { created_at: 'DESC' },
    });
    return items.map((item) => ({
      id: item.id_kho,
      name: item.ten_hang_hoa,
      quantity: item.so_luong,
      supplier: item.nha_cung_cap,
      created_at: item.created_at,
    }));
  }
}

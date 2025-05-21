import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Category } from '../categories/entities/category.entity';
import { Inventory } from 'src/modules/inventory/entities/inventory.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Category)
    private categoryRepo: Repository<Category>,
    @InjectRepository(Inventory)
    private inventoryRepo: Repository<Inventory>,
  ) {}

  async create(dto: CreateProductDto): Promise<Product> {
    // 1. Check tồn tại inventory (kho) theo id_kho
    const inventory = await this.inventoryRepo.findOne({ where: { id_kho: dto.id_kho } });
    if (!inventory) throw new NotFoundException('Lô hàng (kho) không tồn tại');

    // 2. So sánh thuộc tính sản phẩm với inventory
    if (
      (dto.size && inventory.size !== dto.size) ||
      (dto.mau_sac && inventory.mau_sac !== dto.mau_sac) ||
      (dto.chat_lieu && inventory.chat_lieu !== dto.chat_lieu)
    ) {
      throw new BadRequestException('Thuộc tính sản phẩm không khớp với lô hàng trong kho');
    }

    // 3. Kiểm tra số lượng tồn kho
    if (inventory.so_luong < dto.so_luong) {
      throw new BadRequestException('Số lượng vượt quá tồn kho');
    }

    // 4. Trừ số lượng tồn kho
    inventory.so_luong -= dto.so_luong;
    await this.inventoryRepo.save(inventory);

    // 5. Tạo sản phẩm mới
    const product = this.productRepo.create({
      ...dto,
      id_kho: inventory.id_kho,
      kho: inventory,
    });
    return this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id_san_pham: id },
      relations: ['category', 'kho'],
    });
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm');

    // Nếu thay đổi category
    if (dto.id_danh_muc && dto.id_danh_muc !== product.id_danh_muc) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.id_danh_muc } });
      product.category = category ?? product.category;
      product.id_danh_muc = dto.id_danh_muc;
    }

    // Nếu thay đổi lô kho
    if (dto.id_kho && dto.id_kho !== product.id_kho) {
      const kho = await this.inventoryRepo.findOne({ where: { id_kho: dto.id_kho } });
      if (!kho) throw new NotFoundException('Lô kho mới không tồn tại');
      product.kho = kho;
      product.id_kho = dto.id_kho;
    }

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['category', 'kho'] });
  }

  async remove(id: number) {
    const result = await this.productRepo.delete(id);
    if (!result.affected) throw new NotFoundException('Không tìm thấy sản phẩm');
    return { message: 'Xóa thành công' };
  }
}

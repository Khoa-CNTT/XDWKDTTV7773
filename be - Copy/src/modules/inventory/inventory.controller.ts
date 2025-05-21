// ✅ inventory.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  create(@Body() dto: CreateInventoryDto) {
    return this.inventoryService.create(dto);
  }

  @Get()
  async findAll() {
    const data = await this.inventoryService.findAll();
    return data.map((item) => ({
      id: item.id_kho,
      name: item.ten_hang_hoa,
      supplier: item.nha_cung_cap,
      price: Number(item.gia_nhap),
      quantity: item.so_luong,
      size: item.size,
      material: item.chat_lieu,
      color: item.mau_sac,
      status: item.trang_thai,
      created_at: item.created_at,
    }));
  }

  @Get('history')
  getHistory() {
    return this.inventoryService.getHistory();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInventoryDto) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.inventoryService.remove(id);
  }
}

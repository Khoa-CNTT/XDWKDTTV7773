import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  // src/modules/orders/orders.controller.ts
@Get()
async findAll() {
  // Lấy tất cả đơn + user + chi tiết + lịch sử
  const rawData = await this.ordersService.findAll();
  // Chuẩn hóa field (flatten) cho FE dễ dùng
  return rawData.map(order => ({
    id: order.id_don_hang,
    ma_don: order.id_don_hang, // Có thể gen thêm mã format khác
    khach_hang: order.user ? order.user.ho_ten : '', // hoặc user.email, user.sdt
    tong_tien: order.tong_tien,
    trang_thai: order.trang_thai,
    ngay_dat: order.ngay_dat,
    dia_chi_giao: order.dia_chi_giao,
    ma_giam_gia: order.ma_giam_gia,
    chi_tiet: order.chi_tiet?.map(ct => ({
      id_chi_tiet: ct.id_chi_tiet,
      ten_san_pham: ct.product?.ten_san_pham,
      id_san_pham: ct.product?.id_san_pham,
      so_luong: ct.so_luong,
      don_gia: ct.don_gia,
      kich_co: ct.kich_co,
    })) ?? [],
    lich_su: order.lich_su ?? [],
  }));
}

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateOrderDto) {
    return this.ordersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.remove(id);
  }

  @Get('/history/:id')
async getOrderHistory(@Param('id') id: number) {
  return this.ordersService.findByUser(id);
}

}

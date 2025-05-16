import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add')
  addToCart(@Body() dto: AddToCartDto) {
    return this.cartService.addToCart(dto);
  }

  @Get('user')
  getCartByUser(@Query('id_nguoi_dung') id: number) {
    return this.cartService.getCartByUser(Number(id));
  }
}

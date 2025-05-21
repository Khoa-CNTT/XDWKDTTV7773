import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { User } from '../users/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart) private cartRepo: Repository<Cart>,
    @InjectRepository(CartItem) private cartItemRepo: Repository<CartItem>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
  ) {}

  async addToCart(dto: AddToCartDto) {
    const user = await this.userRepo.findOne({ where: { id_nguoidung: dto.id_nguoi_dung } });
    if (!user) throw new NotFoundException('Người dùng không tồn tại');

    let cart = await this.cartRepo.findOne({
      where: { user: { id_nguoidung: dto.id_nguoi_dung } },
      relations: ['items'],
    });

    if (!cart) {
      cart = this.cartRepo.create({ user, ngay_tao: new Date() });
      cart = await this.cartRepo.save(cart);
    }

    const product = await this.productRepo.findOne({ where: { id_san_pham: dto.id_san_pham } });
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại');

    const existingItem = cart.items?.find(
      (item) => item.product.id_san_pham === dto.id_san_pham && item.kich_co === dto.kich_co,
    );

    if (existingItem) {
      existingItem.so_luong += dto.so_luong;
      return this.cartItemRepo.save(existingItem);
    } else {
      const newItem = this.cartItemRepo.create({
        cart,
        product,
        so_luong: dto.so_luong,
        kich_co: dto.kich_co,
      });
      return this.cartItemRepo.save(newItem);
    }
  }

  async getCartByUser(id_nguoi_dung: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id_nguoidung: id_nguoi_dung } },
      relations: ['items', 'items.product'],
    });
    if (!cart) throw new NotFoundException('Giỏ hàng không tồn tại');
    return cart;
  }
}
// src/modules/users/users.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Cập nhật tài khoản + avatar
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto, file);
  }

  // ✅ Lấy thông tin tài khoản đang đăng nhập
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  // ✅ Lấy danh sách tất cả người dùng
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // ✅ Tìm theo id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  // ✅ Tìm theo email
  @Get('email/search')
  findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  // ✅ Tạo mới tài khoản
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // ✅ Khóa / Mở tài khoản
  @Patch(':id/status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleStatus(id);
  }

  // ✅ Xóa tài khoản
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Patch(':id/password')
changePassword(
  @Param('id', ParseIntPipe) id: number,
  @Body() body: { oldPassword: string; newPassword: string },
) {
  return this.usersService.changePassword(id, body.oldPassword, body.newPassword);
}

}

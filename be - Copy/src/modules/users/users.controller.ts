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
import { VaiTro } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.usersService.update(id, updateUserDto, file);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Req() req: any) {
    return this.usersService.findOne(req.user.id);
  }

  // Chỉ giữ 1 route getAll, hỗ trợ ?role=khach_hang
  @Get()
async getAllCustomers(@Query('role') role: string) {
  if (role) {
    return this.usersService.findByRole(role as VaiTro);
  }
  return this.usersService.findAll();
}



  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Get('email/search')
  findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id/status')
  toggleStatus(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.toggleStatus(id);
  }

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

  // Khóa tạm tài khoản (status = false/0)
  @Patch('lock/:id')
  async lockAccount(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.updateStatus(id, false);
  }

  // Mở lại tài khoản (status = true/1)
  @Patch('unlock/:id')
  async unlockAccount(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.updateStatus(id, true);
  }
}

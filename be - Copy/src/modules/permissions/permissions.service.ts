// src/modules/permissions/permissions.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permissions.entity';
import { Repository } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepo: Repository<Permission>,
  ) {}

  async create(dto: CreatePermissionDto) {
    const { accountName, permissions } = dto;

    // Xóa quyền cũ
    await this.permissionRepo.delete({ ten_tai_khoan: accountName });

    const newPermissions: Permission[] = [];

    for (const item of permissions.admin) {
      newPermissions.push(
        this.permissionRepo.create({
          ten_chuc_nang: item.name,
          vai_tro: 'admin',
          ten_tai_khoan: accountName,
        }),
      );
    }

    for (const item of permissions.staff) {
      newPermissions.push(
        this.permissionRepo.create({
          ten_chuc_nang: item.name,
          vai_tro: 'nhan_vien',
          ten_tai_khoan: accountName,
        }),
      );
    }

    return await this.permissionRepo.save(newPermissions);
  }

  async findByUser(accountName: string) {
    return await this.permissionRepo.find({ where: { ten_tai_khoan: accountName } });
  }
}

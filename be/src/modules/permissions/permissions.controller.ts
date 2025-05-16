// src/modules/permissions/permissions.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly service: PermissionsService) {}

  @Post()
  create(@Body() dto: CreatePermissionDto) {
    return this.service.create(dto);
  }

  @Get(':accountName')
  findByUser(@Param('accountName') name: string) {
    return this.service.findByUser(name);
  }
}

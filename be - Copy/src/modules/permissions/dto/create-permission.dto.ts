// src/modules/permissions/dto/create-permission.dto.ts
import { IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class PermissionItem {
  @IsString()
  name: string;

  @IsString()
  id: string;
}

export class CreatePermissionDto {
  @IsString()
  accountName: string;

  @ValidateNested()
  @Type(() => PermissionListDto)
  permissions: PermissionListDto;
}

class PermissionListDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionItem)
  admin: PermissionItem[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PermissionItem)
  staff: PermissionItem[];
}

// src/modules/users/dto/user-response.dto.ts
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  status: string;
  avatar?: string;
}

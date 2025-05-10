export class RegisterDto {
  ho_ten: string;
  email: string;
  so_dien_thoai: string;
  dia_chi: string;
  vai_tro: 'khach_hang' | 'nhan_vien' | 'quan_ly';
  trang_thai?: boolean;
}

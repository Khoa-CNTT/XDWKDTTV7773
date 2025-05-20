import { API_BASE_URL } from '@/app/lib/api';

export async function register(data: {
  ho_ten: string;
  email: string;
  password: string;
  so_dien_thoai: string;
  dia_chi: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Đăng ký thất bại');
  return res.json();
}

import { API_BASE_URL } from "@/app/lib/api";

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error('Đăng nhập thất bại');
  return res.json(); // { access_token: '...' }
}

import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';
import crypto from 'crypto';

const vnp_TmnCode = 'YOUR_TMN_CODE'; // Thay bằng mã TMN của bạn
const vnp_HashSecret = 'YOUR_HASH_SECRET'; // Thay bằng secret của bạn
const vnp_Url = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
const vnp_ReturnUrl = 'https://thedeliacouture.com/api/vnpay/return'; // Đổi thành domain thật khi deploy

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { amount, orderId, orderDesc, ipAddr, email } = body;

  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode,
    vnp_Amount: (amount * 100).toString(),
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: orderDesc,
    vnp_OrderType: 'other',
    vnp_Locale: 'vn',
    vnp_ReturnUrl,
    vnp_IpAddr: ipAddr || '127.0.0.1',
    vnp_CreateDate: new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14),
    ...(email ? { vnp_Bill_Email: email } : {}),
  };

  // Sắp xếp tham số
  const sorted = Object.keys(vnp_Params).sort().reduce((r, k) => (r[k] = vnp_Params[k], r), {} as Record<string, string>);
  const signData = qs.stringify(sorted, { encode: false });
  const secureHash = crypto.createHmac('sha512', vnp_HashSecret).update(signData).digest('hex');
  sorted.vnp_SecureHash = secureHash;

  const paymentUrl = `${vnp_Url}?${qs.stringify(sorted, { encode: true })}`;
  return NextResponse.json({ paymentUrl });
} 
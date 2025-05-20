import { NextResponse } from 'next/server';
import crypto from 'crypto';
import qs from 'qs';

const config = {
  vnp_TmnCode: process.env.VNP_TMNCODE!,
  vnp_HashSecret: process.env.VNP_HASHSECRET!,
  vnp_Url: process.env.VNP_URL!,
  vnp_ReturnUrl: process.env.VNP_RETURNURL!,
};

function sortObject(obj: Record<string, any>) {
  const sorted: Record<string, any> = {};
  const keys = Object.keys(obj).sort();
  for (let key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}

export async function POST(req: Request) {
  const body = await req.json();
  const ipAddr = req.headers.get('x-forwarded-for') || '127.0.0.1';

  const date = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');
  const createDate = `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
  const orderId = `${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;

  let locale = body.language || 'vn';
  let bankCode = body.bankCode || '';
  let amount = body.amount || 0;

  let vnp_Params: Record<string, any> = {
    vnp_Version: '2.1.0',
    vnp_Command: 'pay',
    vnp_TmnCode: config.vnp_TmnCode,
    vnp_Locale: locale,
    vnp_CurrCode: 'VND',
    vnp_TxnRef: orderId,
    vnp_OrderInfo: body.orderDescription,
    vnp_OrderType: body.orderType,
    vnp_Amount: amount * 100,
    vnp_ReturnUrl: config.vnp_ReturnUrl,
    vnp_IpAddr: ipAddr,
    vnp_CreateDate: createDate,
  };
  if (bankCode) vnp_Params['vnp_BankCode'] = bankCode;

  vnp_Params = sortObject(vnp_Params);

  const signData = qs.stringify(vnp_Params, { encode: false });
  const hmac = crypto.createHmac('sha512', config.vnp_HashSecret);
  const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
  vnp_Params['vnp_SecureHash'] = signed;

  const vnpUrl = config.vnp_Url + '?' + qs.stringify(vnp_Params, { encode: false });

  return NextResponse.json({ paymentUrl: vnpUrl });
} 
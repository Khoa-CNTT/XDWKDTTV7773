import { NextRequest, NextResponse } from 'next/server';
import qs from 'qs';
import crypto from 'crypto';

const vnp_HashSecret = 'YOUR_HASH_SECRET'; // Thay bằng secret của bạn

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const vnp_SecureHash = params['vnp_SecureHash'];
  delete params['vnp_SecureHash'];
  delete params['vnp_SecureHashType'];

  const sorted = Object.keys(params).sort().reduce((r, k) => (r[k] = params[k], r), {} as Record<string, string>);
  const signData = qs.stringify(sorted, { encode: false });
  const checkHash = crypto.createHmac('sha512', vnp_HashSecret).update(signData).digest('hex');

  // Xác thực checksum và giao dịch thành công
  if (vnp_SecureHash === checkHash && params['vnp_ResponseCode'] === '00') {
    // Redirect về trang my-order với trạng thái thành công và truyền mã đơn hàng
    return NextResponse.redirect(`https://thedeliacouture.com/profile/my-order?orderId=${params['vnp_TxnRef']}&status=success`);
  } else {
    // Redirect về trang my-order với trạng thái thất bại
    return NextResponse.redirect('https://thedeliacouture.com/profile/my-order?status=fail');
  }
} 
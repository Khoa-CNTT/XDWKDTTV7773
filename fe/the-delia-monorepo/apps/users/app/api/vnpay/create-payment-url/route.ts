import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import querystring from 'querystring';

// Sử dụng hàm sortObject theo đúng mẫu VNPay
function sortObject(obj: Record<string, any>) {
  let sorted: Record<string, any> = {};
  let str: string[] = [];
  let key: any;
  for (key in obj){
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
  }
  return sorted;
}

export async function POST(req: NextRequest) {
  try {
    const { amount, orderId, orderInfo, bankCode = '' } = await req.json();
    
    if (!amount || !orderId || !orderInfo) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Đặt múi giờ Việt Nam
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    const date = new Date();
    
    // Format createDate theo đúng định dạng VNPAY: YYYYMMDDHHmmss
    const createDate = date.getFullYear().toString() +
                      (date.getMonth() + 1).toString().padStart(2, '0') +
                      date.getDate().toString().padStart(2, '0') +
                      date.getHours().toString().padStart(2, '0') + 
                      date.getMinutes().toString().padStart(2, '0') + 
                      date.getSeconds().toString().padStart(2, '0');
                      
    // Sử dụng mã giao dịch giống hệt mẫu của VNPay
    let txnRef = date.getDate().toString().padStart(2, '0') + 
                date.getHours().toString().padStart(2, '0') + 
                date.getMinutes().toString().padStart(2, '0') + 
                date.getSeconds().toString().padStart(2, '0');
    console.log('Generated txnRef:', txnRef);
    
    const tmnCode = process.env.VNP_TMNCODE;
    // Sử dụng các giá trị cứng từ mẫu thay vì dùng biến môi trường
    const secretKey = 'WKYPYYODBZQ55605DL9F8R7EQH7XW4KR';
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    // Sử dụng localhost thay vì delia.localtest.me vì tên miền này không hoạt động
    const returnUrl = 'http://localhost:3001/order/vnpay_return';
    console.log('VNPay URL:', vnpUrl);
    console.log('Return URL:', returnUrl);
    console.log('TMN Code: 7RF8OAS5');
    
    if (!tmnCode || !secretKey || !vnpUrl) {
      return NextResponse.json(
        { error: 'VNPAY configuration missing' },
        { status: 500 }
      );
    }

    const locale = 'vn';
    const currCode = 'VND';
    
    // Chỉ sử dụng orderId cho ref, không cần gắn thêm đuôi
    const refId = orderId;
    
    // Lấy địa chỉ IP từ request header hoặc sử dụng giá trị mặc định
    // Trong môi trường thực tế, ip sẽ được chuyển qua các header như x-forwarded-for, x-real-ip
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : 
              req.headers.get('x-real-ip') || 
              '116.110.40.119'; // Sử dụng IP public mặc định nếu không lấy được từ request
    
    console.log('Client IP:', ip);
    
    // Sử dụng các tham số và giá trị giống hệt mẫu của VNPay
    let vnpParams: Record<string, any> = {};
    vnpParams['vnp_Version'] = '2.1.0';
    vnpParams['vnp_Command'] = 'pay';
    vnpParams['vnp_TmnCode'] = '7RF8OAS5'; // Sử dụng giá trị cứng từ mẫu
    vnpParams['vnp_Locale'] = 'vn';
    vnpParams['vnp_CurrCode'] = 'VND';
    vnpParams['vnp_TxnRef'] = txnRef;
    vnpParams['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + txnRef;
    vnpParams['vnp_OrderType'] = 'other';
    vnpParams['vnp_Amount'] = Math.round(amount) * 100;
    vnpParams['vnp_ReturnUrl'] = 'http://localhost:3001/order/vnpay_return'; 
    vnpParams['vnp_IpAddr'] = ip;
    vnpParams['vnp_CreateDate'] = createDate;
    vnpParams['vnp_BankCode'] = 'NCB';
    
    
    if (bankCode) {
      vnpParams.vnp_BankCode = bankCode;
    }
    
    // Sắp xếp tham số theo thứ tự bảng chữ cái
    const sortedParams = sortObject(vnpParams);
    console.log('Sorted params:', sortedParams);
    
    // Tạo chuỗi dữ liệu cần ký theo đúng mẫu của VNPay
    let querystring = require('qs');
    let signData = querystring.stringify(sortedParams, { encode: false });
    
    console.log('Sign data string:', signData);
    
    // Tạo chữ ký bằng HMAC-SHA512 giống hệt mẫu của VNPay
    let hmac = crypto.createHmac('sha512', secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    // Add the secure hash to the parameters
    sortedParams.vnp_SecureHash = signed;
    
    // Tạo URL thanh toán theo mẫu VNPay
    let vnpUrlWithParams = vnpUrl + '?' + querystring.stringify(sortedParams, { encode: false });
    console.log('Final URL:', vnpUrlWithParams);
    
    return NextResponse.json({ paymentUrl: vnpUrlWithParams });
  } catch (error) {
    console.error('Error creating VNPAY payment URL:', error);
    return NextResponse.json(
      { error: 'Failed to create payment URL' },
      { status: 500 }
    );
  }
}

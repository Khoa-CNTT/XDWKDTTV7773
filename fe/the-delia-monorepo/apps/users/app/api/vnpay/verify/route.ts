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

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params: Record<string, any> = {};
    
    // Get all parameters
    for (const [key, value] of url.searchParams.entries()) {
      params[key] = value;
    }
    
    const secureHash = params['vnp_SecureHash'];
    delete params['vnp_SecureHash'];
    delete params['vnp_SecureHashType'];
    
    // Sort params before signing
    const sortedParams = sortObject(params);
    
    // Sử dụng giá trị cứng từ mẫu thay vì biến môi trường
    const secretKey = 'WKYPYYODBZQ55605DL9F8R7EQH7XW4KR';
    
    if (!secretKey) {
      return NextResponse.json(
        { 
          RspCode: '99', 
          Message: 'VNPAY configuration missing' 
        },
        { status: 500 }
      );
    }
    
    // Tạo chuỗi dữ liệu cần ký theo đúng mẫu VNPay
    let querystring = require('qs');
    let signData = querystring.stringify(sortedParams, { encode: false });
    
    console.log('Verify sign data string:', signData);
    
    // Tạo chữ ký bằng HMAC-SHA512 giống hệt mẫu của VNPay
    let hmac = crypto.createHmac('sha512', secretKey);
    let calculatedHash = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    
    console.log('Calculated hash:', calculatedHash);
    console.log('Received hash:', secureHash);
    
    // Response data
    const responseCode = params['vnp_ResponseCode'];
    const transactionStatus = params['vnp_TransactionStatus'];
    const orderId = params['vnp_TxnRef'];
    const amount = parseInt(params['vnp_Amount']) / 100; // Convert back from VNPAY format
    
    // Verify signature
    if (secureHash === calculatedHash) {
      // Signature verified
      const success = responseCode === '00' && transactionStatus === '00';
      
      return NextResponse.json({
        orderId,
        amount,
        RspCode: success ? '00' : responseCode,
        Message: success ? 'Payment successful' : 'Payment failed',
        success
      });
    } else {
      // Invalid signature
      return NextResponse.json({
        orderId,
        RspCode: '97',
        Message: 'Invalid signature',
        success: false
      });
    }
  } catch (error) {
    console.error('Error verifying VNPAY payment:', error);
    return NextResponse.json(
      { 
        RspCode: '99', 
        Message: 'Error processing payment verification',
        success: false
      },
      { status: 500 }
    );
  }
}

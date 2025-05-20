import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    console.log('Nhận yêu cầu quên mật khẩu từ frontend cho email:', email);

    if (!email) {
      return NextResponse.json(
        { message: 'Email không được để trống' },
        { status: 400 }
      );
    }

    // Gọi API từ backend để xử lý forgot password
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    console.log(`Gọi API backend: ${backendUrl}/api/auth/forgot-password`);
    
    const response = await fetch(`${backendUrl}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log('Response từ backend:', data);
    
    if (!response.ok) {
      console.error('Backend response not OK:', response.status, data);
      throw new Error(data.message || 'Lỗi khi gửi yêu cầu đặt lại mật khẩu');
    }

    // Trả về phản hồi thật từ backend
    console.log('Backend response:', data);
    
    console.log('Kiểm tra response body từ backend:', JSON.stringify(data));
    
    // Truy xuất OTP từ backend trong môi trường phát triển (nếu có)
    let otpFromBackend = null;
    
    // Kiểm tra chi tiết cấu trúc của data
    console.log('Data type:', typeof data);
    console.log('Data keys:', Object.keys(data));
    console.log('Data có otp?', data.hasOwnProperty('otp'));
    
    // Kiểm tra xem backend có trả về OTP không (chỉ trong môi trường phát triển)
    if (typeof data === 'object' && data.otp) {
      console.log('Backend đã trả về OTP:', data.otp);
      otpFromBackend = data.otp;
    } else {
      console.log('Không tìm thấy OTP trong response từ backend');
    }
    
    // Tạo response với các thu1ed9c tính cơ bản
    const response_json: Record<string, any> = {
      message: data.message || 'Đã gửi mã OTP thành công',
      success: true
    };
    
    // Chỉ gửi OTP nếu backend trả về (chỉ trong môi trường phát triển)
    if (otpFromBackend) {
      response_json.otp = otpFromBackend;
    }
    
    return NextResponse.json(response_json, { status: 200 });
  } catch (error) {
    console.error('Lỗi khi xử lý yêu cầu quên mật khẩu:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Đã xảy ra lỗi khi xử lý yêu cầu',
        success: false
      },
      { status: 500 }
    );
  }
}
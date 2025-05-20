// API service cho ứng dụng frontend

// Định nghĩa các interfaces cho dữ liệu trả về từ API
export interface User {
  id?: string | number;
  id_nguoidung?: string | number;
  ho_ten?: string;
  email?: string;
  so_dien_thoai?: string;
  dia_chi?: string;
  vai_tro?: string;
  trang_thai?: boolean;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Cho phép các trường khác nếu có
}

export interface ApiResponse {
  error?: boolean;
  status?: number;
  message?: string;
  isAuthError?: boolean;
  isServerError?: boolean;
  isNetworkError?: boolean;
  data?: any;
  user?: User;
  [key: string]: any;
}

export interface UserResponse extends ApiResponse {
  user?: User;
  data?: User | any;
  isOfflineData?: boolean; // Đánh dấu nếu dữ liệu được lấy từ cache offline
}

export interface AuthResponse {
  message?: string;
  access_token: string;
  user?: User;
  data?: User | any;
  otp?: string;  // Chỉ dùng trong môi trường phát triển
  [key: string]: any; // Cho phép các trường khác nếu có
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

// Sử dụng cổng 3000 để phù hợp với backend
// Nếu có biến môi trường NEXT_PUBLIC_API_URL thì sử dụng, nếu không thì dùng mặc định
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const API_BASE_URL = `${API_URL}/api`;

// Helper function để xử lý response và các lỗi API - KHDL: NEVER THROWS VERSION
export async function handleResponse<T>(response: Response): Promise<T> {
  // Lưu trạng thái response cho debug
  const responseStatus = {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    time: new Date().toISOString()
  };
  
  // Ghi lại trạng thái response để theo dõi
  console.log('API Response:', responseStatus);
  
  try {
    // Xử lý ngay các response không ok (status code khác 2xx)
    if (!response.ok) {
      const errorResponse: ApiResponse = {
        error: true,
        status: response.status,
        message: response.statusText || `Lỗi HTTP ${response.status}`,
        isAuthError: response.status === 401,
        isServerError: response.status >= 500,
      };
      
      // Thử đọc dữ liệu lỗi từ API nếu có
      try {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorResponse.message = errorData.message || errorData.error || errorResponse.message;
          if (errorData.user) errorResponse.user = errorData.user;
          if (errorData.data) errorResponse.data = errorData.data;
        } else {
          // Nếu không phải JSON, thử đọc text
          errorResponse.message = await response.text() || errorResponse.message;
        }
      } catch (parseError) {
        // Giữ nguyên thông báo lỗi ban đầu nếu không đọc được
        console.warn('Không thể đọc nội dung lỗi từ server:', parseError);
      }
      
      // Xử lý lỗi 401 Unauthorized
      if (response.status === 401) {
        console.warn('Phát hiện lỗi xác thực 401:', errorResponse.message);
        
        // Bỏ comment để tránh xóa token quá sớm, chỉ xóa token khi người dùng đăng xuất
        // clearAuthTokens();
        
        // Không sử dụng console.error với lỗi 401 vì có thể gây crash trong Next.js
        return errorResponse as unknown as T;
      }
      
      // Sử dụng warn thay vì error để tránh crash trong Next.js
      console.warn(`API Error (${response.status}):`, errorResponse.message);
      return errorResponse as unknown as T;
    }
    
    // Trường hợp status code 204 No Content hoặc response rỗng
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return { success: true, status: 204 } as unknown as T;
    }

    // Xử lý các response thành công có nội dung
    try {
      const contentType = response.headers.get('content-type') || '';
      
      // Kiểm tra xem response có phải JSON hay không
      if (contentType.includes('application/json')) {
        const data = await response.json();
        // Trả về dữ liệu thành công
        return data as T;
      } else {
        // Response không phải JSON
        const textData = await response.text();
        // Đóng gói nội dung text thành object
        return { success: true, data: textData, message: textData } as unknown as T;
      }
    } catch (parseError) {
      console.error('Lỗi khi xử lý response thành công:', parseError);
      // Vẫn trả về kết quả thành công nếu không parse được response
      return {
        success: true,
        status: response.status,
        message: 'Không thể đọc dữ liệu phản hồi, nhưng yêu cầu đã thành công',
      } as unknown as T;
    }
  } catch (unexpectedError) {
    // Bắt tất cả lỗi bất ngờ để tránh crash app
    console.error('Lỗi không xác định khi xử lý API response:', unexpectedError);
    
    // Trả về lỗi generic
    return {
      error: true,
      message: unexpectedError instanceof Error 
        ? unexpectedError.message 
        : 'Lỗi không xác định khi kết nối với máy chủ',
      isNetworkError: true,
    } as unknown as T;
  }
};

// Hàm tìm token hợp lệ từ các nguồn khác nhau
const findValidToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const sources = [
    sessionStorage.getItem('auth_token'),
    localStorage.getItem('auth_token'),
    localStorage.getItem('token'),
    localStorage.getItem('next-auth.session-token'),
    document.cookie.split('; ').find(row => row.startsWith('next-auth.session-token='))?.split('=')[1]
  ];
  
  for (const token of sources) {
    if (token && token.length > 10) {
      return token;
    }
  }
  
  return null;
};

// Hàm xóa tất cả các token xác thực (dùng khi đăng xuất hoặc token hết hạn)
const clearAuthTokens = () => {
  if (typeof window !== 'undefined') {
    // Xóa tất cả các token liên quan đến API và xác thực
    localStorage.removeItem('auth_token');
    sessionStorage.removeItem('auth_token');
    localStorage.removeItem('token');
    localStorage.removeItem('user_info');
    
    // Xóa cả các token của NextAuth nếu cần thiết
    // localStorage.removeItem('next-auth.session-token');
  }
};

// Class quản lý API calls
export class ApiService {
  put<T>(arg0: string, arg1: { itemId: number; quantity: number; }) {
    throw new Error('Method not implemented.');
  }
  private baseUrl: string;
  
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }
  
  // Lấy token từ nhiều nguồn khác nhau và đảm bảo đúng định dạng
  private getAuthToken(): string {
    if (typeof window !== 'undefined') {
      // Thử nhiều vị trí lưu trữ token khác nhau
      const sources = [
        localStorage.getItem('auth_token'),         // auth_token từ login API trực tiếp
        sessionStorage.getItem('auth_token'),      // auth_token trong session storage
        localStorage.getItem('token'),              // key dùng bởi admin app
        localStorage.getItem('next-auth.session-token'), // NextAuth session
      ];
      
      // Tìm token hợp lệ đầu tiên
      let validToken = '';
      for (const token of sources) {
        if (token && token.length > 0) {
          validToken = token;
          break;
        }
      }
      
      // Nếu tìm thấy token
      if (validToken) {
        // Đảm bảo token có đầu "Bearer "
        if (validToken.startsWith('Bearer ')) {
          return validToken;
        } else {
          return `Bearer ${validToken}`;
        }
      }
      
      // In ra console để debug nếu không tìm thấy token nào
      console.warn('API Service: Không tìm thấy token xác thực!');
    }
    return '';
  }
  
  // Tạo headers cho request
  private getHeaders(contentType = 'application/json'): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': contentType,
    };
    
    const token = this.getAuthToken();
    if (token) {
      // Token đã được đảm bảo có prefix 'Bearer ' trong hàm getAuthToken()
      headers['Authorization'] = token;
      
      // In ra console để debug
      console.log(`API call with Authorization: ${token.substring(0, 15)}...`);
    } else {
      console.warn('API call without Authorization token!');
    }
    
    return headers;
  }
  
  // Gọi API với method GET
  async get<T extends ApiResponse = ApiResponse>(endpoint: string): Promise<T> {
    try {
      console.log(`Đang gọi API GET: ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache',
      });
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      console.error(`Lỗi khi gọi API GET ${endpoint}:`, error);
      // Trả về đối tượng lỗi để tránh crash ứng dụng
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Lỗi không xác định khi kết nối với máy chủ',
        isNetworkError: true,
      } as T;
    }
  }
  
  // Gọi API với method POST
  async post<T extends ApiResponse = ApiResponse>(endpoint: string, data: any): Promise<T> {
    try {
      console.log(`Đang gọi API POST: ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      console.error(`Lỗi khi gọi API POST ${endpoint}:`, error);
      // Trả về đối tượng lỗi để tránh crash ứng dụng
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Lỗi không xác định khi kết nối với máy chủ',
        isNetworkError: true,
      } as T;
    }
  }
  
  // Gọi API với method PATCH
  async patch<T extends ApiResponse = ApiResponse>(endpoint: string, data: any): Promise<T> {
    try {
      console.log(`Đang gọi API PATCH: ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      console.error(`Lỗi khi gọi API PATCH ${endpoint}:`, error);
      // Trả về đối tượng lỗi để tránh crash ứng dụng
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Lỗi không xác định khi kết nối với máy chủ',
        isNetworkError: true,
      } as T;
    }
  }
  
  // Gọi API với method DELETE
  async delete<T extends ApiResponse = ApiResponse>(endpoint: string): Promise<T> {
    try {
      console.log(`Đang gọi API DELETE: ${this.baseUrl}${endpoint}`);
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      console.error(`Lỗi khi gọi API DELETE ${endpoint}:`, error);
      // Trả về đối tượng lỗi để tránh crash ứng dụng
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Lỗi không xác định khi kết nối với máy chủ',
        isNetworkError: true,
      } as T;
    }
  }
  
  // Gọi API upload file
  async upload<T extends ApiResponse = ApiResponse>(endpoint: string, formData: FormData): Promise<T> {
    try {
      console.log(`Đang gọi API upload: ${this.baseUrl}${endpoint}`);
      const token = this.getAuthToken();
      const headers: HeadersInit = {};
      
      if (token) {
        headers['Authorization'] = token;
      }
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      return handleResponse(response) as Promise<T>;
    } catch (error) {
      console.error(`Lỗi khi gọi API upload ${endpoint}:`, error);
      // Trả về đối tượng lỗi để tránh crash ứng dụng
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Lỗi không xác định khi kết nối với máy chủ',
        isNetworkError: true,
      } as T;
    }
  }
}

// Tạo instance mặc định của ApiService
export const api = new ApiService();

// Service cho authentication
export const authService = {
  login: async (email: string, password: string) => {
    try {
      console.log(`Đang gọi API login: ${API_BASE_URL}/auth/login`);
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Lỗi đăng nhập:', error);
        return {
          error: true,
          message: error.message || 'Đăng nhập thất bại',
          isAuthError: true
        };
      }
      
      const data = await response.json();
      
      // Lưu token vào localStorage và sessionStorage
      if (data.access_token) {
        localStorage.setItem('auth_token', data.access_token);
        sessionStorage.setItem('auth_token', data.access_token);
        
        // Lưu thông tin người dùng nếu có
        if (data.user) {
          localStorage.setItem('user_info', JSON.stringify(data.user));
        }
      }
      
      return data;
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      // Trả về đối tượng lỗi thay vì throw error để tránh crash ứng dụng
      return {
        error: true,
        message: error instanceof Error ? error.message : 'Lỗi không xác định khi kết nối với máy chủ',
        isNetworkError: true,
      };
    }
  },
  
  register: (userData: any) => {
    return api.post('/auth/register', userData);
  },
  
  forgotPassword: (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },
  
  resetPassword: (data: { email: string, otp: string, password: string }) => {
    return api.post('/auth/reset-password', data);
  },
  
  verifyOtp: (data: { email: string, otp: string }) => {
    return api.post('/auth/verify-otp', data);
  }
};

// Đảm bảo token có sẵn cho các API calls
export const ensureAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  
  // Kiểm tra các nguồn token
  const token = findValidToken();
  if (token) {
    // Đảm bảo token có đầu Bearer
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
    // Lưu vào cả hai nơi để đảm bảo tính khả dụng
    localStorage.setItem('auth_token', formattedToken);
    sessionStorage.setItem('auth_token', formattedToken);
  }
};

// Service cho user
export const userService = {
  // Lấy thông tin người dùng hiện tại - KHÔNG BAO GIỜ NÉM LỖI
  getProfile: async (): Promise<UserResponse> => {
    // Trước tiên, lấy dữ liệu từ localStorage để trả về ngay lập tức
    let cachedUserData: UserResponse | null = null;
    const fallbackData: UserResponse = { user: { ho_ten: 'Người dùng', email: 'user@example.com' } };
    
    // Thử lấy từ localStorage
    try {
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        const userData = JSON.parse(userInfo);
        console.log('Sử dụng thông tin user từ localStorage:', userData);
        cachedUserData = { user: userData, isOfflineData: true };
      }
    } catch (e) {
      console.error('Lỗi đọc cache:', e);
    }
    
    // Xử lý token trước mỗi lần gọi
    ensureAuthToken();
    
    // Thử gọi API với endpoint /users/me
    const response: ApiResponse = await api.get<ApiResponse>('/users/me');
    
    // Kiểm tra xem response có phải là lỗi hay không
    if (response.error) {
      console.warn(`API Error: ${response.message}`);
      
      // Nếu là lỗi xác thực, ghi log để debug
      if (response.isAuthError) {
        console.warn('Unauthorized error: Sử dụng dữ liệu cache nếu có');
      }
      
      // Nếu có lỗi, trả về dữ liệu cache (nếu có)
      if (cachedUserData) {
        console.log('Sử dụng dữ liệu đã lưu trong cache');
        return cachedUserData;
      }
      
      // Thử với endpoint thay thế
      const altResponse: ApiResponse = await api.get<ApiResponse>('/auth/profile');
      
      // Kiểm tra kết quả từ endpoint thay thế
      if (!altResponse.error && (altResponse.user || altResponse.data)) {
        const userData = altResponse.user || altResponse.data;
        console.log('Lấy được dữ liệu từ endpoint thay thế');  
        localStorage.setItem('user_info', JSON.stringify(userData));
        return { user: userData } as UserResponse;
      }
      
      // Trả về dữ liệu mặc định nếu không có gì khác
      return fallbackData;
    }
    
    // Nếu API call thành công
    if (response.user) {
      console.log('API call thành công, lưu dữ liệu vào cache');
      // Lưu vào cache để sử dụng sau này
      localStorage.setItem('user_info', JSON.stringify(response.user));
      return response as UserResponse;
    } else if (response.data) {
      // Một số API trả về dữ liệu trong trường data
      const userData = typeof response.data === 'object' ? response.data : { data: response.data };
      localStorage.setItem('user_info', JSON.stringify(userData));
      return { user: userData } as UserResponse;
    }
    
    // Nếu API không có lỗi nhưng cũng không có dữ liệu hợp lệ
    console.warn('API không trả về lỗi nhưng cũng không có dữ liệu hợp lệ');
    
    // Dùng dữ liệu cache nếu có
    if (cachedUserData) {
      return cachedUserData;
    }
    
    // Trường hợp xấu nhất - không có dữ liệu nào
    console.warn('Trả về dữ liệu mặc định vì không lấy được thông tin người dùng');
    return fallbackData;
  },
  
  // Cập nhật thông tin profile - KHÔNG BAO GIỜ NÉM LỖI
  updateProfile: async (userId: string, userData: any): Promise<ApiResponse> => {
    try {
      // Đảm bảo token hợp lệ trước khi gọi API
      ensureAuthToken();
      
      // Lưu vào cache trước để dự phòng
      const userInfo = localStorage.getItem('user_info');
      if (userInfo) {
        try {
          const parsedUser = JSON.parse(userInfo);
          const updatedUser = { ...parsedUser, ...userData };
          localStorage.setItem('user_info', JSON.stringify(updatedUser));
        } catch (e) {
          console.warn('Lỗi khi cập nhật user_info trong localStorage:', e);
        }
      }
      
      // Sử dụng endpoint /users/me thay vì /users/{id}
      // API hiện đại thường có endpoint riêng để cập nhật user hiện tại
      console.log("Thử cập nhật với endpoint /users/me");
      const response = await api.patch('/users/me', userData);
      
      return response;
    } catch (error) {
      console.warn('Lỗi khi cập nhật profile:', error);
      
      // Xử lý lỗi nhưng không ném ra ngoài
      if (error instanceof Error) {
        return {
          error: true,
          status: error.name === 'TypeError' ? 0 : 500,
          message: error.message,
          isAuthError: error.message.includes('unauthorized') || error.message.includes('Unauthorized') || error.message.includes('401'),
          isNetworkError: error.message.includes('network') || error.message.includes('fetch'),
          isServerError: error.message.includes('server') || error.message.includes('500'),
          data: null
        };
      }
      
      // Lỗi không xác định
      return {
        error: true,
        status: 0,
        message: 'Lỗi không xác định khi cập nhật profile',
        isNetworkError: true,
        data: null
      };
    }
  },
  
  // Upload ảnh đại diện
  updateAvatar: (userId: string, formData: FormData) => {
    return api.upload(`/users/${userId}/avatar`, formData);
  }
};

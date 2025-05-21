export const successResponse = (data: any, message = 'Thành công') => ({
  success: true,
  message,
  data,
});

export const errorResponse = (message = 'Đã xảy ra lỗi', code = 400) => ({
  success: false,
  message,
  code,
});

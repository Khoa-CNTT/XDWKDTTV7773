'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/app/context/CartContext'
import styles from './Checkout.module.css'
import Image from 'next/image'
import Header from '@/app/components/Header'
import Footer from '@/app/components/Footer'
import FloatingIcons from '@/app/components/FloatingIcons'
import { toast } from 'react-toastify'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

// Initialize Stripe with your publishable key
// Providing an empty string as fallback to prevent TypeError when environment variable is undefined
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

interface ShippingAddress {
  name: string;
  phone: string;
  address: string;
}

export default function CheckoutPageClient() {
  const router = useRouter()
  const { cartItems } = useCart()
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: 'Việt Nam',
    city: '',
    district: '',
    street: '',
    postalCode: '',
    note: '',
  })
  const [promoCode, setPromoCode] = useState('')
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const stripe = useStripe()
  const elements = useElements()

  // Fetch PaymentIntent client secret when Visa/MasterCard is selected
  useEffect(() => {
    if (paymentMethod === 'visa') {
      const fetchClientSecret = async () => {
        try {
          const response = await fetch('/api/visa/create-payment-intent', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount: total }),
          })
          const data = await response.json()
          if (data.clientSecret) {
            setClientSecret(data.clientSecret)
          } else {
            toast.error('Không thể khởi tạo thanh toán')
          }
        } catch (error) {
          toast.error('Lỗi khi khởi tạo thanh toán')
        }
      }
      fetchClientSecret()
    }
  }, [paymentMethod, total])

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error('Nhập mã khuyến mãi')
      return
    }
    // Add promo code validation logic here
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const fullAddress = `${formData.street}, ${formData.district}, ${formData.city}, ${formData.country}`
    setSavedAddress({
      name: formData.name,
      phone: formData.phone,
      address: fullAddress
    })
  }

  const handleUseOtherAddress = () => {
    setSavedAddress(null)
  }

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      toast.error('Chưa có sản phẩm để thanh toán')
      return
    }

    // Check if address is saved or form is filled
    if (!savedAddress && (!formData.name || !formData.phone || !formData.street || !formData.district || !formData.city)) {
      toast.error('Bạn chưa nhập địa chỉ giao hàng')
      return
    }

    if (paymentMethod === 'visa') {
      if (!stripe || !elements || !clientSecret) {
        toast.error('Hệ thống thanh toán chưa sẵn sàng')
        return
      }

      setIsLoading(true)

      try {
        const cardElement = elements.getElement(CardElement)
        if (!cardElement) {
          toast.error('Thông tin thẻ không hợp lệ')
          setIsLoading(false)
          return
        }

        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: savedAddress?.name || formData.name,
              address: {
                line1: formData.street,
                city: formData.city,
                country: 'VN',
                postal_code: formData.postalCode,
              },
              email: formData.email,
              phone: formData.phone,
            },
          },
        })

        if (error) {
          toast.error(error.message || 'Thanh toán thất bại')
          setIsLoading(false)
          return
        }

        if (paymentIntent?.status === 'succeeded') {
          toast.success('Thanh toán thành công!')
          // Lưu đơn hàng vào localStorage
          const paymentStatus = paymentMethod === 'visa' || paymentMethod === 'vnpay' ? 'paid' : 'cod';
          const paidAmount = paymentStatus === 'paid' ? cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0) : 0;
          const newOrder = {
            id: 'ORDER' + Date.now(),
            status: 'processing',
            createdAt: new Date().toISOString().slice(0, 10),
            items: cartItems,
            total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
            paymentStatus,
            paidAmount,
          };
          const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
          localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
          // Add logic to save order, clear cart, redirect, etc.
          router.push('/profile/my-order')
        }
      } catch (error) {
        toast.error('Lỗi trong quá trình thanh toán')
      } finally {
        setIsLoading(false)
      }
    } else if (paymentMethod === 'cod') {
      // Xử lý thanh toán khi nhận hàng (COD)
      setIsLoading(true);
      try {
        const newOrder = {
          id: 'ORDER' + Date.now(),
          status: 'processing',
          createdAt: new Date().toISOString().slice(0, 10),
          items: cartItems,
          total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
          paymentStatus: 'cod',
          paidAmount: 0,
        };
        const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
        localStorage.setItem('orders', JSON.stringify([newOrder, ...existingOrders]));
        toast.success('Đã đặt hàng thành công');
        router.push('/profile/my-order');
      } catch (error) {
        toast.error('Có lỗi khi đặt hàng');
      } finally {
        setIsLoading(false);
      }
    } else if (paymentMethod === 'vnpay') {
      // Xử lý thanh toán qua VNPay
      try {
        const orderId = `DL${Date.now()}`;
        const orderInfo = `Thanh toan don hang ${orderId}`;

        // Sử dụng API để tạo URL thanh toán VNPAY
        const response = await fetch('/api/vnpay/create-payment-url', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Math.round(total),
            orderId,
            orderInfo,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Không thể tạo đường dẫn thanh toán');
        }

        console.log('VNPAY URL created:', data.paymentUrl);

        // Lưu thông tin đơn hàng trước khi chuyển hướng
        const orderData = {
          id: orderId,
          items: cartItems,
          total: total,
          shipping: formData,
          paymentMethod: 'vnpay',
          paymentStatus: 'pending',
          createdAt: new Date().toISOString()
        };

        // Lưu thông tin đơn hàng vào localStorage
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Chuyển hướng đến trang thanh toán VNPAY
        window.location.href = data.paymentUrl;
      } catch (error) {
        console.error('VNPay payment error:', error);
        toast.error('Có lỗi xảy ra khi tạo thanh toán VNPay. Vui lòng thử lại.');
        setIsLoading(false);
      }
    } else {
      toast.info(`Tiếp tục với phương thức thanh toán: ${paymentMethod}`)
    }
  }

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.checkoutContainer}>
          <div className={styles.leftColumn}>
            <h1>Thủ tục thanh toán</h1>
            
            {savedAddress ? (
              <div className={styles.savedAddress}>
                <div className={styles.addressHeader}>
                  <h2>Địa chỉ vận chuyển</h2>
                  <button className={styles.editButton}>Chỉnh sửa</button>
                </div>
                <div className={styles.addressInfo}>
                  <p className={styles.recipientName}>{savedAddress.name}</p>
                  <p className={styles.addressDetail}>Địa chỉ: {savedAddress.address}</p>
                  <p className={styles.phoneNumber}>Số điện thoại: {savedAddress.phone}</p>
                  <button 
                    className={styles.useOtherAddressButton}
                    onClick={handleUseOtherAddress}
                  >
                    Sử dụng địa chỉ khác
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <label>
                    Họ và tên
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Địa chỉ Email
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>
                      Quốc gia
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>
                      Số điện thoại
                      <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Thành phố/tỉnh
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Quận</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>
                    Đường
                    <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Mã bưu điện</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                  />
                </div>

                <div className={styles.buttonGroup}>
                  <button type="button" className={styles.cancelButton}>
                    HỦY
                  </button>
                  <button type="submit" className={styles.submitButton}>
                    LƯU
                  </button>
                </div>
              </form>
            )}

            <div className={styles.shippingMethod}>
              <h2>Phương thức vận chuyển</h2>
              <div className={styles.shippingSelect}>
                <select>
                  <option value="">Chọn phương thức vận chuyển</option>
                </select>
              </div>
              <div className={styles.shippingInfo}>
                <p className={styles.freeShipping}>
                  <span className={styles.freeIcon}>🎉</span>
                  <span className={styles.freeText}>Miễn phí</span> vận chuyển nội địa thông qua ViettelPost
                </p>
                <p className={styles.shippingNote}>
                  *Các đơn đặt hàng Đặc biệt/may đo có thể mất thời gian lâu hơn.{' '}
                  <a href="/chinh-sach-van-chuyen" className={styles.policyLink}>
                    Xem thêm ở chính sách vận chuyển
                  </a>
                </p>
              </div>
            </div>

            <div className={styles.cartSection}>
              <h2>Giỏ hàng</h2>
              <div className={styles.cartItems}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.productImageWrapper}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className={styles.productImage}
                      />
                      <span className={styles.lockIcon}>🔒</span>
                    </div>
                    <div className={styles.itemDetails}>
                      <h3>{item.name}</h3>
                      <p>Vải: Light Gray</p>
                      <p>Size: {item.size}</p>
                      <div className={styles.itemQuantity}>
                        <span>x{item.quantity}</span>
                        <span className={styles.itemPrice}>{item.price.toLocaleString()}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.promoSection}>
              <h2>The Delia Couture khuyến mãi</h2>
              <div className={styles.promoCode}>
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Nhập mã khuyến mãi"
                />
                <button 
                  className={styles.applyButton}
                  onClick={handleApplyPromo}
                >
                  Áp dụng
                </button>
              </div>
            </div>

            <div className={styles.orderSummary}>
              <h2>Thanh toán</h2>
              <div className={styles.summaryRow}>
                <span>Tạm tính</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Phí vận chuyển</span>
                <span>0đ</span>
              </div>
              <div className={styles.summaryTotal}>
                <span>Tổng cộng</span>
                <span>{total.toLocaleString()}đ</span>
              </div>
            </div>

            <textarea
              className={styles.orderNote}
              placeholder="Để lại ghi chú cho đơn hàng"
            />

            <div className={styles.paymentSection}>
              <h3 className={styles.paymentTitle}>Chọn phương thức thanh toán</h3>
              
              <div className={styles.paymentMethods}>
                <label className={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="payment"
                    value="vnpay"
                    checked={paymentMethod === 'vnpay'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className={styles.radioCustom}></span>
                  <div className={styles.methodIcon}>
                    <Image src="/images/payment/vnpay.png" alt="VNPay" width={25} height={25} />
                  </div>
                  <span className={styles.methodName}>Thanh toán bằng VNPay</span>
                </label>

                <label className={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="payment"
                    value="visa"
                    checked={paymentMethod === 'visa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className={styles.radioCustom}></span>
                  <div className={styles.methodIcon}>
                    <Image src="/images/payment/visa.png" alt="Visa" width={40} height={25} />
                  </div>
                  <span className={styles.methodName}>Thẻ Visa/Master Card</span>
                </label>

                <label className={styles.paymentMethod}>
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className={styles.radioCustom}></span>
                  <div className={styles.methodIcon}>🚚</div>
                  <span className={styles.methodName}>Thanh toán khi nhận hàng</span>
                </label>
              </div>

              {paymentMethod === 'visa' && (
                <div className={styles.formGroup} style={{ marginTop: '1.5rem' }}>
                  <label>Thông tin thẻ</label>
                  <CardElement
                    options={{
                      style: {
                        base: {
                          fontSize: '16px',
                          color: '#000',
                          '::placeholder': {
                            color: '#666',
                          },
                        },
                        invalid: {
                          color: '#ff4d4f',
                        },
                      },
                    }}
                  />
                </div>
              )}

              <button 
                className={styles.checkoutButton}
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? 'Đang xử lý...' : 'Thanh toán'}
              </button>
            </div>
          </div>
        </div>
      </div>
      <FloatingIcons />
    </>
  )
}
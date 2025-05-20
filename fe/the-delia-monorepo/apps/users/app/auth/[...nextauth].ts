import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";

// Mở rộng các kiểu dữ liệu để hỗ trợ thêm trường tùy chỉnh
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    vai_tro?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      provider?: string;
      vai_tro?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    provider?: string;
    vai_tro?: string;
  }
}

// Tạo cấu hình NextAuth riêng để dễ quản lý
export const authOptions: NextAuthOptions = {
  providers: [
    // Cho phép đăng nhập với thông tin cơ bản để test
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Đây chỉ là demo, trong thực tế bạn nên kiểm tra với database
        if (credentials?.email === "admin@deliashop.com" && credentials?.password === "Admin@123") {
          return { 
            id: "1", 
            name: "Admin", 
            email: "admin@deliashop.com",
            vai_tro: "admin"
          };
        }
        return null;
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret',
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || 'dummy-client-id',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || 'dummy-client-secret',
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Lưu thông tin user vào token
      if (user) {
        token.id = user.id;
        token.provider = account?.provider || 'credentials';
        token.email = user.email;
        token.name = user.name;
        token.vai_tro = user.vai_tro;
      }
      return token;
    },
    async session({ session, token }) {
      // Gán thông tin từ token vào session
      if (token && session.user) {
        session.user.id = token.id;
        session.user.provider = token.provider;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.vai_tro = token.vai_tro;
      }
      return session;
    },
  },
  // Cấu hình bảo mật và debug
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-make-it-secure',
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/login',
    error: '/error',
  },
};

// Xuất handler mặc định cho route API của NextAuth
export default NextAuth(authOptions);

/* app/api/auth/[...nextauth]/route.ts */
import NextAuth, { type NextAuthOptions, type Session, type User } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import { type Account, type Profile } from "next-auth";

// Định nghĩa kiểu cho User
interface CustomUser extends User {
  id: string;
  name?: string | null;
  email?: string | null;
}

// Định nghĩa kiểu cho Token (JWT)
interface CustomToken extends JWT {
  id?: string;
}

// Định nghĩa kiểu cho Session
interface CustomSession extends Session {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error("Vui lòng cung cấp email và mật khẩu");
          }

          // Logic xác thực (thay thế bằng API hoặc database thực tế nếu cần)
          if (
            credentials.email === "user@example.com" &&
            credentials.password === "password"
          ) {
            return {
              id: "1",
              name: "User",
              email: "user@example.com",
            };
          }

          throw new Error("Thông tin đăng nhập không hợp lệ");
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : "Authentication failed";
          console.error("Authorize error:", message);
          throw new Error(message);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development", // Giữ debug: true để ghi lại lỗi
  callbacks: {
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      try {
        // Kiểm tra nếu có redirect trong URL
        const redirectUrl = new URL(url).searchParams.get("redirect");
        if (redirectUrl) {
          return redirectUrl;
        }
        // Nếu không có redirect, quay về trang gốc (url) hoặc baseUrl
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        if (url.startsWith(baseUrl)) return url;
        return baseUrl;
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Redirect failed";
        console.error("Redirect callback error:", message);
        return baseUrl; // Trả về baseUrl nếu có lỗi
      }
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      const customSession = session as CustomSession;
      const customToken = token as CustomToken;
      if (customToken && customSession.user) {
        customSession.user.id = customToken.id;
      }
      return customSession;
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      const customToken = token as CustomToken;
      const customUser = user as CustomUser | undefined;
      if (customUser) {
        customToken.id = customUser.id;
      }
      return customToken;
    },
  },
  pages: {
    signIn: "/auth/login", // Trang đăng nhập tùy chỉnh
  },
  events: {
    async signIn(message: { user: User; account: Account | null; profile?: Profile; isNewUser?: boolean }) {
      console.log("SignIn event:", message);
    },
    async signOut(message: { session: Session; token: JWT }) {
      console.log("SignOut event:", message);
    },
    // Xóa sự kiện error vì không được hỗ trợ
  },
};

// Kiểm tra biến môi trường trước khi khởi tạo NextAuth
const requiredEnvVars = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "FACEBOOK_CLIENT_ID",
  "FACEBOOK_CLIENT_SECRET",
  "NEXTAUTH_SECRET",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing environment variable: ${envVar}`);
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
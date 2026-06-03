import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/app/globals.css"
import { cn } from "@/lib/utils";
import { cookies } from "next/headers";
import ClientLayoutWrapper from "@/components/providers/client-layout-wrapper";
import { AuthDto } from "@/types/auth";
import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BookingMakeup - Nền tảng kết nối trang điểm",
  description: "Nền tảng kết nối bạn đến những dịch vụ trang điểm hàng đầu",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //Setup AuthProvider
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  const savedUserCookie = cookieStore.get('user_data')?.value;
  let initialUser: AuthDto | null = null;

  if (token && savedUserCookie) {
    try {
      initialUser = JSON.parse(savedUserCookie) as AuthDto;
    } catch {
      initialUser = null;
    }
  }

  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayoutWrapper initialUser={initialUser}>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}

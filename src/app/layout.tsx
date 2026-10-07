import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '클린핏 미니 정기 리뷰 분석기 | 하루살림',
  description: '무선 청소기 「클린핏 미니」 정기 리뷰 분석 및 소비자 위해 정보 교차 검증 대시보드',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}

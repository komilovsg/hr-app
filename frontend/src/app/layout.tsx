import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'HR System MVP',
  description: 'Система для управления сотрудниками с личными кабинетами',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  );
}

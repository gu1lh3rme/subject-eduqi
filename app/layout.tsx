import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'EduQi - Sistema de Gestão',
  description: 'Sistema de gestão de assuntos e questões',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

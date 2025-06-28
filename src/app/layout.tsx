import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { FavoriteProvider } from '@/contexts/FavoriteContext';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Where They Filmed - Locações de Filmes e Séries',
  description:
    'Explore locações reais ao redor do mundo onde filmes e séries famosas foram gravados. Descubra curiosidades e pontos turísticos de cada cenário.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${poppins.variable} antialiased`}>
        <FavoriteProvider>{children}</FavoriteProvider>
      </body>
    </html>
  );
}

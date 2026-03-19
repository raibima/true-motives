import type {Metadata} from 'next';
import {headers} from 'next/headers';
import {Inter, Source_Serif_4} from 'next/font/google';
import {isRTL} from 'react-aria-components';
import './globals.css';
import {cn} from '@/shared/utils';
import {ClientProviders} from './provider';

const inter = Inter({subsets: ['latin'], variable: '--font-sans'});
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
  title: 'TrueMotives — Uncovering the real reasons behind major decisions',
  description:
    'AI-powered deep research into the hidden motivations behind public policies, government decisions, and corporate actions. Grounded in transparent reasoning and sourced evidence.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const acceptLanguage = (await headers()).get('accept-language');
  const lang = acceptLanguage?.split(/[,;]/)[0] || 'en-US';

  return (
    <html
      lang={lang}
      dir={isRTL(lang) ? 'rtl' : 'ltr'}
      className={cn(inter.variable, sourceSerif.variable)}
    >
      <body className="bg-background text-foreground font-sans antialiased">
        <ClientProviders lang={lang}>{children}</ClientProviders>
      </body>
    </html>
  );
}

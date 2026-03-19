import {SiteHeader} from '@/components/SiteHeader';
import {Footer} from '@/components/Footer';

export default function PublicLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="grain-overlay flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';

export const metadata: Metadata = {
  title: 'Alex Morgan | Senior Full-Stack Engineer & Cloud Architect',
  description:
    'Production portfolio of Alex Morgan. Specializing in Next.js 15, TypeScript, Node.js, PostgreSQL, Docker, and distributed systems architecture.',
  keywords: [
    'Alex Morgan',
    'Full-Stack Developer',
    'Software Architect',
    'Next.js',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Cloud Architecture',
  ],
  authors: [{ name: 'Alex Morgan', url: 'https://alexmorgan.dev' }],
  openGraph: {
    title: 'Alex Morgan | Senior Full-Stack Engineer & Cloud Architect',
    description:
      'Explore production systems, case studies, technical competencies, and career opportunities.',
    type: 'website',
    url: 'https://alexmorgan.dev',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-white text-[#00007B] antialiased selection:bg-[#0F9A73] selection:text-white">
        <Providers>
          <Navbar />
          <main className="flex-1 bg-white">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

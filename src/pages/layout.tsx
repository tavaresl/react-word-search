import { Inter } from 'next/font/google'
import Header from "@/components/layout/header";

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main className={inter.className}>
        {children}
      </main>
    </>
  )
}

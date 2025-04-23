// app/layout.tsx
import '../styles/global.css'
import Link from 'next/link'
import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id">
      <body className="bg-gray-50 text-gray-900">
        <nav className="bg-green-700 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="font-bold text-lg">🌳 SI ABANG</h1>
            <div className="space-x-4">
              <Link href="/" className="hover:underline">
                Beranda
              </Link>
              {/* Tambahkan menu lain jika perlu */}
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          {children}
        </main>
      </body>
    </html>
  )
}

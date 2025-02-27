import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // URL'yi al
  const url = request.nextUrl.clone()
  
  // Eğer /anonym_chat ile başlıyorsa, yolu düzenle
  if (url.pathname.startsWith('/anonym_chat')) {
    // "/anonym_chat" prefix'ini kaldır
    url.pathname = url.pathname.replace(/^\/anonym_chat/, '')
    
    // Kök yolsa ama / ile bitmiyorsa, / ekle
    if (url.pathname === '') {
      url.pathname = '/'
    }
    
    return NextResponse.rewrite(url)
  }
  
  return NextResponse.next()
}

// Sadece belirli URL'lerde middleware'i çalıştır
export const config = {
  matcher: ['/anonym_chat/:path*'],
} 
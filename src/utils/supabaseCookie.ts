import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import type { SerializeOptions } from 'cookie';

const isProd = process.env.NODE_ENV === 'production'

const createCookieString = (key: string, value: string, options: Partial<SerializeOptions> = {}) => {
    let cookie = `${key}=${value}; Path=/; HttpOnly; SameSite=Lax`
  
    if (isProd) cookie += '; Secure'
  
    if (options.maxAge) {
      cookie += `; Max-Age=${options.maxAge}`
    }
  
    return cookie
  }
  

const createRemoveCookieString = (key: string) => {
  // สร้าง cookie string สำหรับการลบ cookie (ตั้งให้หมดอายุทันที)
  let cookie = `${key}=deleted; Path=/; HttpOnly; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  
  // เพิ่ม Secure flag ในโหมด production
  if (isProd) cookie += '; Secure'
  
  return cookie
}

export const createSupabaseServerClient = (req: NextRequest, res: NextResponse, remember = false) => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables');
    }

    const maxAge = remember ? 60 * 60 * 24 * 7 : undefined // 7 วัน หรือ session cookie
  
    return createServerClient(
      supabaseUrl,
      supabaseKey,
      {
        cookies: {
          get: (key: string) => req.cookies.get(key)?.value,
          set: (key: string, value: string, options: Partial<SerializeOptions> = {}) => {
            const cookieString = createCookieString(key, value, {
              ...options,
              maxAge, // 👉 ส่ง maxAge เข้าไปอย่างชัดเจน
            });
            res.headers.set('Set-Cookie', cookieString);
          },
          remove: (key: string) => {
            const cookieString = createRemoveCookieString(key);
            res.headers.set('Set-Cookie', cookieString);
          },
        }
      }
    );
  };
  
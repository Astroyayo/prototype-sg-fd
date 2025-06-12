import 'server-only';

import CryptoJS from 'crypto-js';
import { cookies } from 'next/headers';

const secretKey = process.env.SESSION_SECRET ?? "";
const encondedKey = new TextEncoder().encode(secretKey);

const encrypt = (data: string | object): string => {
  const stringData = typeof data === 'object' ? JSON.stringify(data) : data;
  return CryptoJS.AES.encrypt(stringData, 'xD').toString();
};

const decrypt = (encrypted: string): any => {
  if (!encrypted) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, 'xD');
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('Decrypt failed:', e);
    return null;
  }
};

export async function setSession(key: string, data: any) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
  const session = encrypt(data);
  const cookieStore = await cookies();

  cookieStore.set(key, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function getSession<T = any>(key: string) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(key);
  if (!sessionCookie) return null;
  return decrypt(sessionCookie?.value) as T;
}

export async function deleteSession(key: string) {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

export async function deleteAll() {
  const cookieStore = await cookies();
  cookieStore.delete('permissions');
  cookieStore.delete('session');
  cookieStore.delete('accesses');
}

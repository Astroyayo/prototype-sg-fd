import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
//payload for defining the session

const secretKey = process.env.SESSION_SECRET;
const encondedKey = new TextEncoder().encode(secretKey);

//TODO: make definition of session payload
export async function encrypt({
  userId,
  expiresAt,
}: {
  userId: string;
  expiresAt: Date;
}) {
  return new SignJWT({ userId, expiresAt })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(encondedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encondedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch {
    console.log('Error decrypting session');
  }
}

export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000); // 8 hours
  const session = await encrypt({ userId, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

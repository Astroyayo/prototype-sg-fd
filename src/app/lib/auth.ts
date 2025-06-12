import { FormState } from '@/app/lib/definitions';

export async function login(state: FormState, formData: FormData) {
  const username = formData.get('username') ?? null;
  const password = formData.get('password') ?? null;

  // Simulate a login process
  if (username === 'admin' && password === 'password') {
    return { message: 'Login successful' };
  } else {
    return { message: 'Invalid username or password' }; // Login failed
  }
}

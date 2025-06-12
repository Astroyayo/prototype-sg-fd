'use client';

import { login } from '@/app/lib/auth';
import { useActionState } from 'react';

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <form action={action} className='bg-white p-6 rounded shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-4'>Login</h2>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1' htmlFor='username'>
            Username
          </label>
          <input
            type='text'
            id='username'
            name='username'
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring'
            required
          />
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1' htmlFor='password'>
            Password
          </label>
          <input
            type='password'
            id='password'
            name='password'
            className='w-full px-3 py-2 border rounded focus:outline-none focus:ring'
            required
          />
        </div>
        {state && (
          <div className='text-red-500 text-sm mb-4'>{state.message}</div>
        )}
        <button
          type='submit'
          disabled={pending}
          className='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors'
        >
          Login
        </button>
      </form>
    </div>
  );
}

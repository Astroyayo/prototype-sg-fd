'use client';

import InputText from '@/app/components/InputText';
import InputPassword from '@/app/components/inputPassword';
import Button from '@/app/components/button';
import Icon from '@/app/components/icon';
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
          <InputText id='username' name="username" start={
            <Icon icon="person"></Icon>
          }/>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1' htmlFor='password'>
            Password
          </label>
          <InputPassword id='password' name="password" start={
            <Icon icon="password"></Icon>
          }/>
        </div>
        {state && (
          <div className='text-red-500 text-sm mb-4'>{state.message}</div>
        )}
        <Button buttonClass='w-full mt-6' text="Login" isLoading={pending}></Button>
      </form>
    </div>
  );
}

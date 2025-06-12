'use client';

import InputText from '@/app/components/InputText';
import InputPassword from '@/app/components/inputPassword';
import Button from '@/app/components/button';
import Icon from '@/app/components/icon';
import { FormEvent, useState } from 'react';
import api from '../lib/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../lib/auth';
import { AuthResponse, Permission, Access } from '../lib/definitions';

export default function LoginPage() {
  const authStore = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    try{
      setIsLoading(true);
      const response = await api.post<AuthResponse>("seguridad/auth", {
        username,
        password
      })
      if(!response.status){
        toast.error("Credenciales inválidas")
        return;
      }
      await authStore.onAUTH(response.data);
      const accesos = await api.get<Access[]>(`accesos/perfil/permisos/id=${response.data.idPerfil}`)
      if(!accesos.status){
        toast.error("Ocurrió un error al obtener los accesos")
      }
      const permisos = await api.post<Permission[]>(`permisos-usuario/search`,
        {
          usuario:response.data.usuario,
          status: 'ACTIVO'
        }
      )
      if(!permisos.status){
        toast.error("Ocurrió un error al obtener los permisos")
      }
    }
    finally{
      setIsLoading(false);
    }
  }

  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <form onSubmit={handleLogin} className='bg-white p-6 rounded shadow-md w-96'>
        <h2 className='text-2xl font-bold mb-4'>Login</h2>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1' htmlFor='username'>
            Username
          </label>
          <InputText
            value={username}
            onChange={e => setUsername(e.target.value)}
            start={
            <Icon icon="person"></Icon>
          }/>
        </div>
        <div className='mb-4'>
          <label className='block text-sm font-medium mb-1' htmlFor='password'>
            Password
          </label>
          <InputPassword 
            value={password}
            onChange={e => setPassword(e.target.value)}
            id='password'
            name="password"
            start={
            <Icon icon="password"></Icon>
          }/>
        </div>
        <Button buttonClass='w-full mt-6' text="Login" isLoading={isLoading}></Button>
      </form>
    </div>
  );
}

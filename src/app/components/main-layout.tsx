// Layout.tsx
'use client'

import { ReactNode } from 'react';
import UserInfo from './user-info';

interface LayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <nav className="w-full bg-white px-4 flex items-center h-[50px]">
        <div className="w-1/5">
            {/* Puedes agregar contenido aquí si lo necesitas */}
        </div>
        <div className="w-4/5 flex items-center justify-end">
            <div>
            <UserInfo />
            </div>
        </div>
        </nav>
      <div className="flex-grow p-4 bg-gray-100">
        {children}
      </div>
    </div>
  );
}

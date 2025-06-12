'use client'

import React from 'react';
import Loading from './loading';

type Props = {
  text?: string;
  buttonClass?: string;
  buttonStyle?: 'primary' | 'secondary' | 'danger' | string;
  icon?: string;
  size?: 'auto' | 'sm' | 'md' | 'lg';
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const sizeStyles: Record<string, string> = {
  auto: 'h-auto',
  sm: 'h-[30px]',
  md: 'h-[35px]',
  lg: 'h-[40px]',
};

const Button: React.FC<Props> = ({
  text = '',
  buttonClass = '',
  buttonStyle = 'primary',
  icon = '',
  size = 'md',
  type = 'submit',
  isLoading = true,
  disabled = false,
  onClick,
  ...rest
}) => {
  const heightClass = sizeStyles[size] || sizeStyles.md;

  const baseStyle = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-500 text-white hover:bg-gray-600',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }[buttonStyle] || '';

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`relative flex items-center justify-center px-4 rounded ${heightClass} ${baseStyle} ${buttonClass}`}
      {...rest}
    >
      {isLoading && (
        <div className="absolute w-[14px] h-[14px]">
          <Loading></Loading>
        </div>
      )}

      {!isLoading && (
        <span className="flex items-center">
          {icon && (
            <span className={`material-icons text-base ${text ? 'mr-2' : ''}`}>
              {icon}
            </span>
          )}
          <span>{text}</span>
        </span>
      )}

      {isLoading && (
        <span
          className="invisible flex items-center"
          aria-hidden="true"
        >
          {icon && (
            <span className={`material-icons text-base ${text ? 'mr-2' : ''}`}>
              {icon}
            </span>
          )}
          <span>{text}</span>
        </span>
      )}
    </button>
  );
};

export default Button;

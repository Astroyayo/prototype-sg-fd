'use client'

import React, { InputHTMLAttributes, ReactNode } from 'react';

type Props = {
  value?: string;
  start?: ReactNode;
  end?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>;

const InputPassword: React.FC<Props> = ({ value, onChange, start, end, ...rest }) => {
  return (
    <div className="flex items-center border rounded px-2 py-[6px] w-full">
      {start && (
        <div className="w-6 flex items-center justify-center">
          {start}
        </div>
      )}

      <input
        type="password"
        className="flex-1 border-none outline-none px-1"
        value={value}
        onChange={onChange}
        {...rest}
      />

      {end && (
        <div className="w-6 flex items-center justify-center">
          {end}
        </div>
      )}
    </div>
  );
};

export default InputPassword;

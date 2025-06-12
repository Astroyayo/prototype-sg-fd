'use client'

import React from 'react';

type Props = {
  icon: string;
} & React.HTMLAttributes<HTMLSpanElement>;

const Icon: React.FC<Props> = ({ icon, className = '', ...rest }) => {
  return (
    <span className={`material-icons w-ful flex justify-center items-center ${className}`} {...rest}>
      {icon}
    </span>
  );
};

export default Icon;

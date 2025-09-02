import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseClasses = "w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-slate-600",
    secondary: "bg-transparent border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-slate-500 focus:ring-opacity-50 disabled:bg-slate-800 disabled:border-slate-700"
  };

  return (
    <button
      {...props}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
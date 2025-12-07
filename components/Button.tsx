import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  className = '',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-6 py-3 border text-base font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "border-transparent text-white bg-itaca-light hover:bg-blue-600 focus:ring-itaca-light shadow-lg hover:shadow-xl",
    secondary: "border-transparent text-white bg-itaca-dark hover:bg-slate-800 focus:ring-itaca-dark",
    outline: "border-itaca-dark text-itaca-dark bg-transparent hover:bg-itaca-gray focus:ring-itaca-dark",
    white: "border-transparent text-itaca-dark bg-white hover:bg-gray-50 focus:ring-white",
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  kind?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  disabled = false,
  kind = 'primary',
  size = 'md',
}) => {
  // Button sınıfı kombinasyonları
  const getButtonClass = () => {
    let classNames = ['button'];
    
    if (kind === 'secondary') {
      classNames.push('button-secondary');
    } else if (kind === 'danger') {
      classNames.push('button-danger');
    } else if (kind === 'ghost') {
      classNames.push('button-ghost');
    }
    
    if (size === 'sm') {
      classNames.push('button-sm');
    } else if (size === 'lg') {
      classNames.push('button-lg');
    }
    
    return classNames.join(' ');
  };
  
  return (
    <button
      className={getButtonClass()}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button; 
import React from 'react';

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  labelText?: string;
  id?: string;
  invalid?: boolean;
  invalidText?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Input: React.FC<InputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  maxLength,
  onKeyDown,
  labelText,
  id,
  invalid = false,
  invalidText,
  size = 'md',
}) => {
  // Input sınıfı kombinasyonları
  const getInputClass = () => {
    let classNames = ['input'];
    
    if (invalid) {
      classNames.push('input-invalid');
    }
    
    if (size === 'sm') {
      classNames.push('input-sm');
    } else if (size === 'lg') {
      classNames.push('input-lg');
    }
    
    return classNames.join(' ');
  };
  
  return (
    <div className="input-wrapper">
      {labelText && (
        <label htmlFor={id} className="text-body-01 input-label">
          {labelText}
        </label>
      )}
      <input
        id={id}
        className={getInputClass()}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        onKeyDown={onKeyDown}
        aria-invalid={invalid}
      />
      {invalid && invalidText && (
        <div className="input-error-message">{invalidText}</div>
      )}
    </div>
  );
};

export default Input; 
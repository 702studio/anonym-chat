import React from 'react';
import { TextInput } from '@carbon/react';

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
  // Eğer id yoksa, benzersiz bir id oluştur
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  
  return (
    <TextInput
      id={inputId}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      onKeyDown={onKeyDown}
      labelText={labelText || ''}
      invalid={invalid}
      invalidText={invalidText || ''}
      size={size}
    />
  );
};

export default Input; 
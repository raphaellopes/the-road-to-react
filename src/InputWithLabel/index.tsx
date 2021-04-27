import React, { useRef, useEffect } from 'react';

import { InputWithLabelProps } from './types';
import { Label, Input } from './styles';

const InputWithLabel = ({
  id,
  type = 'text',
  value,
  onInputChange,
  isFocused,
  children
}: InputWithLabelProps) => {
  const inputRef = useRef<HTMLInputElement>(null!);

  useEffect(() => {
    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFocused])

  return (
    <>
      <Label htmlFor={id}>{children}</Label>&nbsp;
      <Input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
}

export default InputWithLabel;

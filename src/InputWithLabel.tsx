import React, { ChangeEvent, ReactNode, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Label = styled.label`
  border-top: 1px solid #171212;
  border-left: 1px solid #171212;
  padding-left: 5px;
  font-size: 24px;
`;

const Input = styled.input`
  border: none;
  border-bottom: 1px solid #171212;
  background-color: transparent;
  font-size: 24px;
`;

type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: ReactNode;
}
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

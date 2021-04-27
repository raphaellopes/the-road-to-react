import { ChangeEvent, ReactNode } from 'react';

export type InputWithLabelProps = {
  id: string;
  type?: string;
  value: string;
  onInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: ReactNode;
}

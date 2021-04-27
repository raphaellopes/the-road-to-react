import React, { ChangeEvent, FormEvent } from 'react';
import styled from 'styled-components';

import { ButtonLarge } from './styles';
import InputWithLabel from './InputWithLabel';

const Form = styled.form`
  padding: 10px 0 20px 0;
  display: flex;
  align-items: baseline;
`;

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}: SearchFormProps) => (
  <Form onSubmit={onSearchSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={onSearchInput}
    >
      <strong>Search:</strong>
    </InputWithLabel>

    <ButtonLarge
      type="submit"
      disabled={!searchTerm}
    >
      Submit
    </ButtonLarge>
  </Form>
);

export default SearchForm;

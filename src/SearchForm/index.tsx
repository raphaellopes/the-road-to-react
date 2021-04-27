import React from 'react';

import { ButtonLarge } from '../styles';
import InputWithLabel from '../InputWithLabel';
import { SearchFormProps } from './types';
import { Form } from './styles';


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

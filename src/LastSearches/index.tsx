import React, { FC } from 'react';

import { ButtonSmall } from '../styles';
import { LastSearchesProps } from './types';
import { Container, Title } from './styles';

const LastSearches:FC<LastSearchesProps> = ({ lastSearches, onLastSearch }) => (
  <Container>
    <Title>Last searches:</Title>
    {lastSearches.map((searchTerm, index) => (
      <ButtonSmall
        key={searchTerm + index}
        type="button"
        onClick={() => onLastSearch(searchTerm)}
      >
        {searchTerm}
      </ButtonSmall>
    ))}
  </Container>
)

export default LastSearches;

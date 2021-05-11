import styled from 'styled-components';

export const Container = styled.div`
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0,0,0,0.2);

  > button {
    &:not(:last-child) {
      margin-right: 8px;
    }
  }
`;

export const Title = styled.h3``;

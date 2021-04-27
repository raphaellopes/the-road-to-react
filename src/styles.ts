import styled from 'styled-components';

export const Button = styled.button`
  background: transparent;
  border: 1px solid #171212;
  padding: 5px;
  cursor: pointer;
  transition: all 0.1s ease-in;

  &:hover {
    background: #171212;
    color: #ffffff;

    > svg > g {
      fill: #ffffff;
      stroke: #ffffff;
    }
  }
`;

export const ButtonSmall = styled(Button)`
  padding: 5px;
`;

export const ButtonLarge = styled(Button)`
  padding: 10px;
`;

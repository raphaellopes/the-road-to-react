import styled, { css } from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  padding: 20px;
  background: #83a4d4; /* fallback */
  background: linear-gradient(to left, #b6fbff, #83a4d4);
  color: #171212;
`;

export const HeadlinePrimary = styled.h1`
  font-size: 48px;
  font-weight: 300;
  letter-spacing: 2px;
`;

// buttons
const activeStyle = css`
  background: #171212;
  color: #ffffff;

  > svg > g {
    fill: #ffffff;
    stroke: #ffffff;
  }
`;

export const Button = styled.button<{ active?: boolean }>`
  ${({ active = false }) => `
    background: transparent;
    border: 1px solid #171212;
    padding: 5px;
    cursor: pointer;
    transition: all 0.1s ease-in;

    &:hover {
      ${activeStyle};
    }

    ${active ? activeStyle : ''}
  `}
`;

export const ButtonSmall = styled(Button)`
  padding: 5px;
`;

export const ButtonLarge = styled(Button)`
  padding: 10px;
`;

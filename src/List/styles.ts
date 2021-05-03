import styled from 'styled-components';
import { ButtonSmall } from '../styles';

export const Header = styled.div`
  display: flex;

  > span {
    font-weight: 600;
  }
`;

export const HeaderButton = styled(ButtonSmall)`
  > svg {
    margin-left: 10px;
  }
`;

export const ItemColumn = styled.span`
  ${({ width }: { width: string }) => `
    width: ${width};
    padding: 0 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    > a {
      color: inherit;
    }
  `}
`

export const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;

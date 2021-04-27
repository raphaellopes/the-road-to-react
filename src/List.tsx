import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StoriesType, StoryType } from './types';
import { ButtonSmall } from './styles';

type ListProps = {
  list: StoriesType;
  onRemoveItem: (item:StoryType) => void;
}

const List = ({ list, onRemoveItem }:ListProps) => (
  <>
    {list.map(
      (item) => (
        <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
      )
    )}
  </>
);

const ItemColumn = styled.span`
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

const ItemStyled = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 5px;
`;
type ItemProps = {
  item: StoryType,
  onRemoveItem: (item:StoryType) => void;
};
export const Item = ({
  item,
  onRemoveItem
}: ItemProps) => {
  const { url, title, author, num_comments, points } = item;
  return (
    <ItemStyled>
      <ItemColumn width="40%">
        <a href={url}>{title}</a>
      </ItemColumn>
      <ItemColumn width="30%">{author}</ItemColumn>
      <ItemColumn width="10%">{num_comments}</ItemColumn>
      <ItemColumn width="10%">{points}</ItemColumn>
      <ItemColumn width="10%">
        <ButtonSmall
          type="button"
          onClick={() => onRemoveItem(item)}>
          <FontAwesomeIcon icon="check" data-testid="dismiss" />
        </ButtonSmall>
      </ItemColumn>
    </ItemStyled>
  );
}

export default List;

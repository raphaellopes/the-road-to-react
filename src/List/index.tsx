import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ButtonSmall } from '../styles';
import { ListProps, ItemProps } from './types';
import { ItemContainer, ItemColumn } from './styles';

const List = ({ list, onRemoveItem }:ListProps) => (
  <>
    {list.map(
      (item) => (
        <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
      )
    )}
  </>
);

export const Item = ({
  item,
  onRemoveItem
}: ItemProps) => {
  const { url, title, author, num_comments, points } = item;
  return (
    <ItemContainer>
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
    </ItemContainer>
  );
}

export default List;

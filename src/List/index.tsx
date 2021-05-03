import React, { useState } from 'react';
import { sortBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { ButtonSmall } from '../styles';
import { StoriesType } from '../types';
import { ListProps, ItemProps, SortTypes, SortDictType } from './types';
import { Header, ItemContainer, ItemColumn } from './styles';

const List = ({ list, onRemoveItem }:ListProps) => {
  const [sort, setSort] = useState<SortTypes>('NONE');

  const SORTS:SortDictType = {
    NONE: (data:StoriesType) => data,
    TITLE: (data:StoriesType) => sortBy(data, 'title'),
    AUTHOR: (data:StoriesType) => sortBy(data, 'author'),
    COMMENT: (data:StoriesType) => sortBy(data, 'num_comments').reverse(),
    POINT: (data:StoriesType) => sortBy(data, 'points').reverse(),
  };

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);
  const isActive:(value:SortTypes) => boolean = (value) => value === sort;

  const handleSort = (sortKey:SortTypes) => {
    setSort(sortKey);
  }

  const renderHeader = (
    <Header>
      <ItemColumn width="40%">
        <ButtonSmall
          type="button"
          onClick={() => handleSort('TITLE')}
          active={isActive('TITLE')}
        >
          Title
        </ButtonSmall>
      </ItemColumn>
      <ItemColumn width="30%">
        <ButtonSmall
          type="button"
          onClick={() => handleSort('AUTHOR')}
          active={isActive('AUTHOR')}
        >
          Author
        </ButtonSmall>
      </ItemColumn>
      <ItemColumn width="10%">
        <ButtonSmall
          type="button"
          onClick={() => handleSort('COMMENT')}
          active={isActive('COMMENT')}
        >
          Comments
        </ButtonSmall>
      </ItemColumn>
      <ItemColumn width="10%">
        <ButtonSmall
          type="button"
          onClick={() => handleSort('POINT')}
          active={isActive('POINT')}
        >
          Points
        </ButtonSmall>
      </ItemColumn>
      <ItemColumn width="10%">Actions</ItemColumn>
    </Header>
  );

  return (
    <div>
      {renderHeader}
      {sortedList.map(
        (item) => (
          <Item key={item.objectID} onRemoveItem={onRemoveItem} item={item} />
        )
      )}
    </div>
  );
};

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

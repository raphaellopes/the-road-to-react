import React, { useState } from 'react';
import { sortBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { StoriesType } from '../types';
import { ListProps, ItemProps, SortTypes, SortDictType, SortStateType } from './types';
import { Header, HeaderButton, ItemContainer, ItemColumn } from './styles';

const List = ({ list, onRemoveItem }:ListProps) => {
  const [sort, setSort] = useState<SortStateType>({
    sortKey: 'NONE',
    isReverse: false
  });

  const SORTS:SortDictType = {
    NONE: (data:StoriesType) => data,
    TITLE: (data:StoriesType) => sortBy(data, 'title'),
    AUTHOR: (data:StoriesType) => sortBy(data, 'author'),
    COMMENT: (data:StoriesType) => sortBy(data, 'num_comments').reverse(),
    POINT: (data:StoriesType) => sortBy(data, 'points').reverse(),
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse ? sortFunction(list).reverse() : sortFunction(list);
  const isActive:(value:SortTypes) => boolean = (value) => value === sort.sortKey;

  const handleSort = (sortKey:SortTypes) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;
    setSort({
      sortKey,
      isReverse
    });
  }

  const renderSortIcon = (sortKey:SortTypes) => {
    const icon = isActive(sortKey) && !sort.isReverse ? 'arrow-up' : 'arrow-down';
    return (
      <FontAwesomeIcon icon={icon} />
    );
  }

  const renderHeader = (
    <Header>
      <ItemColumn width="40%">
        <HeaderButton
          type="button"
          onClick={() => handleSort('TITLE')}
          active={isActive('TITLE')}
        >
          Title
          {renderSortIcon('TITLE')}
        </HeaderButton>
      </ItemColumn>
      <ItemColumn width="30%">
        <HeaderButton
          type="button"
          onClick={() => handleSort('AUTHOR')}
          active={isActive('AUTHOR')}
        >
          Author
          {renderSortIcon('AUTHOR')}
        </HeaderButton>
      </ItemColumn>
      <ItemColumn width="10%">
        <HeaderButton
          type="button"
          onClick={() => handleSort('COMMENT')}
          active={isActive('COMMENT')}
        >
          Comments
          {renderSortIcon('COMMENT')}
        </HeaderButton>
      </ItemColumn>
      <ItemColumn width="10%">
        <HeaderButton
          type="button"
          onClick={() => handleSort('POINT')}
          active={isActive('POINT')}
        >
          Points
          {renderSortIcon('POINT')}
        </HeaderButton>
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
        <HeaderButton
          type="button"
          onClick={() => onRemoveItem(item)}>
          <FontAwesomeIcon icon="check" data-testid="dismiss" />
        </HeaderButton>
      </ItemColumn>
    </ItemContainer>
  );
}

export default List;

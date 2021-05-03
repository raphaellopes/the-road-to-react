import { StoriesType, StoryType } from '../types';

export type ListProps = {
  list: StoriesType;
  onRemoveItem: (item:StoryType) => void;
}

export type ItemProps = {
  item: StoryType,
  onRemoveItem: (item:StoryType) => void;
};

export type SortTypes = 'TITLE' | 'AUTHOR' | 'COMMENT' | 'POINT' | 'NONE';

export type SortDictType = {
  [key:string]: (data:StoriesType) => StoriesType
};

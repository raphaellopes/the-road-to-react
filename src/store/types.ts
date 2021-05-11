import { StoriesType, StoryType } from '../types';

// reducer
export type StoriesStateType = {
  data: StoriesType;
  isLoading: boolean;
  isError: boolean;
  page: number
}

export interface StoriesFetchInitActionType {
  type: 'STORIES_FETCH_INIT';
}

export interface StoriesFetchSuccessActionType {
  type: 'STORIES_FETCH_SUCCESS';
  payload: {
    list: StoriesType;
    page: number
  }
}

export interface StoriesFetchFailureActionType {
  type: 'STORIES_FETCH_FAILURE';
}

export interface StoriesRemoveActionType {
  type: 'REMOVE_STORY';
  payload: StoryType;
}

export type StoriesActionType =
  | StoriesFetchInitActionType
  | StoriesFetchSuccessActionType
  | StoriesFetchFailureActionType
  | StoriesRemoveActionType;

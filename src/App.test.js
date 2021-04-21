import { render, screen } from '@testing-library/react';
import App, { storiesReducer, SearchForm, Item, List, InputWithLabel } from './App';

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan',
  num_comments: 3,
  points: 4,
  objectID: 0
};

const storyTwo = {
  title: 'Redux',
  url: 'https://redux.js.org/',
  author: 'Dan Abramov, Andrew Clark',
  num_comments: 2,
  points: 5,
  objectID: 1
};

const stories = [storyOne, storyTwo];

describe('storiesReducer', () => {
  test('removes a story from all stories', () => {
    const action = { type: 'REMOVE_STORY', payload: storyOne };
    const state = { data: stories, isLoading: false, isError: false};
    const newState = storiesReducer(state, action);
    const expectedState = { ...state, data: [storyTwo] };
    expect(newState).toStrictEqual(expectedState);
  });

  test('set is loading when fetch init is called', () => {
    const action = { type: 'STORIES_FETCH_INIT' };
    const state = { data: [], isLoading: false, isError: false};
    const newState = storiesReducer(state, action);
    const expectedState = { ...state, isLoading: true};
    expect(newState).toStrictEqual(expectedState);
  });

  test('should put the data value when the success is called', () => {
    const action = { type: 'STORIES_FETCH_SUCCESS', payload: stories };
    const state = { data: [], isLoading: true, isError: false};
    const newState = storiesReducer(state, action);
    const expectedState = { ...state, data: stories, isLoading: false};
    expect(newState).toStrictEqual(expectedState);
  });

  test('should set an error when the error action is called', () => {
    const action = { type: 'STORIES_FETCH_FAILURE' };
    const state = { data: [], isLoading: true, isError: false};
    const newState = storiesReducer(state, action);
    const expectedState = { ...state, isLoading: false, isError: true};
    expect(newState).toStrictEqual(expectedState);
  });
})

import { storyOne, storyTwo, stories } from '../mockedTests';
import { storiesReducer } from './index';

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
    const action = {
      type: 'STORIES_FETCH_SUCCESS',
      payload: {
        list: stories,
        page: 0
      }
    };
    const state = { data: [], isLoading: true, isError: false, page: 0};
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
});

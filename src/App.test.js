import { render, screen, fireEvent, act } from '@testing-library/react';
import axios from 'axios';
import App, { storiesReducer } from './App';
import { storyOne, storyTwo, stories } from './mockedTests';

jest.mock('axios');

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
});

describe('App', () => {
  test('succeeds fetching data', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories
      }
    });

    axios.get.mockImplementationOnce(() => promise);
    render(<App />);

    expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    await act(() => promise);

    expect(screen.queryByText(/Loading/)).toBeNull();
    expect(screen.queryByText(/React/)).toBeInTheDocument();
    expect(screen.queryByText(/Redux/)).toBeInTheDocument();
    expect(screen.queryAllByTestId('dismiss').length).toBe(2);
  });

  // @TODO: Check why  is not working with try catch
  // test('fails fetching data', async () => {
    // const promise = Promise.reject();
    // axios.get.mockImplementationOnce(() => promise);
    // render(<App />);

    // expect(screen.queryByText(/Loading/)).toBeInTheDocument();

    // try {
      // await act(() => promise);
    // } catch (e) {
      // expect(screen.queryByText(/Loading/)).toBeNull();
      // expect(screen.queryByText(/went wrong/)).toBeInTheDocument();
    // }

  // });

  test('removes a story', async () => {
    const promise = Promise.resolve({
      data: {
        hits: stories
      }
    });

    axios.get.mockImplementationOnce(() => promise);
    render(<App />);

    await act(() => promise);

    expect(screen.queryAllByTestId('dismiss').length).toBe(2);
    expect(screen.queryByText(/Jordan Walke/)).toBeInTheDocument();

    fireEvent.click(screen.queryAllByTestId('dismiss')[0]);
    expect(screen.queryAllByTestId('dismiss').length).toBe(1);
    expect(screen.queryByText(/Jordan Walke/)).toBeNull();
  });

  test('searching for specific stories', async () => {
    const reactPromise = Promise.resolve({
      data: {
        hits: stories
      }
    });

    const anotherStory = {
      title: 'JavaScript',
      url: 'https://en.wikipedia.org/wiki/JavaScript',
      author: 'Brendan Eich',
      num_comments: 15,
      points: 10,
      objectID: 3
    };

    const javaScripPromise = Promise.resolve({
      data: {
        hits: [anotherStory]
      }
    });

    axios.get.mockImplementation(url => {
      if (url.includes('React')) {
        return reactPromise;
      } else if (url.includes('JavaScript')) {
        return javaScripPromise;
      } else {
        throw Error();
      }
    });

    render(<App />);
    await act(() => reactPromise);

    expect(screen.queryByDisplayValue('React')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('JavaScript')).toBeNull();
    expect(screen.queryByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeInTheDocument();
    expect(screen.queryByText('Brendan Eich')).toBeNull();

    fireEvent.change(screen.queryByDisplayValue('React'), {
      target: {
        value: 'JavaScript'
      }
    });

    expect(screen.queryByDisplayValue('React')).toBeNull();
    expect(screen.queryByDisplayValue('JavaScript')).toBeInTheDocument();

    fireEvent.submit(screen.queryByText('Submit'));
    await act(() => javaScripPromise);

    expect(screen.queryByText('Jordan Walke')).toBeNull();
    expect(screen.queryByText('Dan Abramov, Andrew Clark')).toBeNull();
    expect(screen.queryByText('Brendan Eich')).toBeInTheDocument();
  });
})

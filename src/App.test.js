import { render, screen, fireEvent, act } from '@testing-library/react';
import App, { storiesReducer, SearchForm, Item, List, InputWithLabel } from './App';

const storyOne = {
  title: 'React',
  url: 'https://reactjs.org/',
  author: 'Jordan Walke',
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
});

describe('Item', () => {
  test('renders all properties', () => {
    render(<Item item={storyOne} />);
    expect(screen.getByText('Jordan Walke')).toBeInTheDocument();
    expect(screen.getByText('React')).toHaveAttribute(
      'href',
      'https://reactjs.org/'
    );
  });

  test('renders a clickable dismiss button', () => {
    render(<Item item={storyOne} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('clicking the dismiss button calls the callback handler', () => {
    const handleRemoveItem = jest.fn();
    render(<Item item={storyOne} onRemoveItem={handleRemoveItem} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
  });
});

describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'React',
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
  };

  test('renders the input field with its value', () => {
    render(<SearchForm {...searchFormProps} />);
    expect(screen.getByDisplayValue('React')).toBeInTheDocument();
  });

  test('renders the correct label', () => {
    render(<SearchForm {...searchFormProps} />);
    expect(screen.getByLabelText(/Search/)).toBeInTheDocument();
  });

  test('calls onSearchInput on input field change', () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.change(screen.getByDisplayValue('React'), {
      target: { value: 'Redux' }
    });
    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
  });

  test('calls onSearchSubmit on button submit click', () => {
    render(<SearchForm {...searchFormProps} />);
    fireEvent.submit(screen.getByRole('button'));
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
  });
});

describe('List', () => {
  const listProps = {
    list: stories,
    onRemoveItem: jest.fn(),
  };

  test('renders the list with its properties', () => {
    render(<List {...listProps} />);
    expect(screen.getAllByRole('button').length).toBe(2);
  });

  test('calls onRemoveItem for first item', () => {
    render(<List {...listProps} />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(listProps.onRemoveItem).toHaveBeenCalledTimes(1);
  });
});

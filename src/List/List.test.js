import { render, screen, fireEvent } from '@testing-library/react';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { stories, storyOne } from '../mockedTests';

import List, { Item } from './index';

library.add(faCheck, faArrowUp, faArrowDown);

describe('List', () => {
  const listProps = {
    list: stories,
    onRemoveItem: jest.fn(),
  };

  test('renders snapshot', () => {
    const { container } = render(<List {...listProps} />)
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders the list with its properties', () => {
    render(<List {...listProps} />);
    expect(screen.getAllByTestId('dismiss').length).toBe(2);
  });

  test('calls onRemoveItem for first item', () => {
    render(<List {...listProps} />);
    fireEvent.click(screen.getAllByTestId('dismiss')[0]);
    expect(listProps.onRemoveItem).toHaveBeenCalledTimes(1);
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

  test('renders snapshot', () => {
    const { container } = render(<Item item={storyOne} />)
    expect(container.firstChild).toMatchSnapshot();
  });
});

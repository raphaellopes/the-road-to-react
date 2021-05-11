import { render, screen, fireEvent, act } from '@testing-library/react';
import LastSearches from './index';

describe('LastSearches', () => {
  const props = {
    lastSearches: ['React', 'Redux'],
    onLastSearch: jest.fn()
  }

  test('renders snapshot', () => {
    const { container } = render(<LastSearches {...props} />)
    expect(container.firstChild).toMatchSnapshot();
  });

  test('renders the component with its properties', () => {
    render(<LastSearches {...props} />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Redux')).toBeInTheDocument();
  });

  test('calls onLastSearch with its value', () => {
    render(<LastSearches {...props} />);
    fireEvent.click(screen.getByText('React'));
    expect(props.onLastSearch).toHaveBeenCalledTimes(1);
    expect(props.onLastSearch).toHaveBeenCalledWith('React');
  });
});

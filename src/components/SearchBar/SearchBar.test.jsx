import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from './SearchBar';

jest.mock('../../assets/close.svg', () => 'close-icon.svg');

const defaultProps = {
  value: '',
  onChange: jest.fn(),
  count: 20,
};

describe('SearchBar', () => {
  it('renders the input', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('does not show the clear button when input is empty', () => {
    render(<SearchBar {...defaultProps} />);
    expect(screen.queryByLabelText('Limpiar búsqueda')).not.toBeInTheDocument();
  });

  it('shows the clear button when input has a value and clears on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SearchBar {...defaultProps} value="samsung" onChange={onChange} />);
    const clearBtn = screen.getByLabelText('Limpiar búsqueda');
    expect(clearBtn).toBeInTheDocument();
    await user.click(clearBtn);
    expect(onChange).toHaveBeenCalledWith('');
  });
});

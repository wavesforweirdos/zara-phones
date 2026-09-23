import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StorageSelector from './StorageSelector';

const options = [
  { capacity: '128 GB', price: 999 },
  { capacity: '256 GB', price: 1099 },
  { capacity: '512 GB', price: 1199 },
];

describe('StorageSelector', () => {
  it('renders all storage options', () => {
    render(<StorageSelector options={options} selected={null} onChange={jest.fn()} />);
    expect(screen.getByText('128 GB')).toBeInTheDocument();
    expect(screen.getByText('256 GB')).toBeInTheDocument();
    expect(screen.getByText('512 GB')).toBeInTheDocument();
  });

  it('calls onChange with the correct storage option on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<StorageSelector options={options} selected={null} onChange={onChange} />);
    await user.click(screen.getByText('256 GB'));
    expect(onChange).toHaveBeenCalledWith({ capacity: '256 GB', price: 1099 });
  });

  it('selected option has the --selected class', () => {
    render(
      <StorageSelector
        options={options}
        selected={{ capacity: '512 GB', price: 1199 }}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByText('512 GB')).toHaveClass('storage-selector__chip--selected');
    expect(screen.getByText('128 GB')).not.toHaveClass('storage-selector__chip--selected');
  });
});

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ColorSelector from './ColorSelector';

const options = [
  { name: 'Black', hexCode: '#000000' },
  { name: 'White', hexCode: '#ffffff' },
  { name: 'Blue', hexCode: '#0000ff' },
];

describe('ColorSelector', () => {
  it('renders all color options', () => {
    render(<ColorSelector options={options} selected={null} onChange={jest.fn()} />);
    expect(screen.getAllByRole('radio')).toHaveLength(3);
    expect(screen.getByLabelText('Color: Black')).toBeInTheDocument();
    expect(screen.getByLabelText('Color: White')).toBeInTheDocument();
    expect(screen.getByLabelText('Color: Blue')).toBeInTheDocument();
  });

  it('calls onChange with the correct color on click', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<ColorSelector options={options} selected={null} onChange={onChange} />);
    await user.click(screen.getByLabelText('Color: White'));
    expect(onChange).toHaveBeenCalledWith({ name: 'White', hexCode: '#ffffff' });
  });

  it('selected option has the --selected class', () => {
    render(
      <ColorSelector
        options={options}
        selected={{ name: 'Blue', hexCode: '#0000ff' }}
        onChange={jest.fn()}
      />
    );
    expect(screen.getByLabelText('Color: Blue')).toHaveClass('color-selector__swatch--selected');
    expect(screen.getByLabelText('Color: Black')).not.toHaveClass(
      'color-selector__swatch--selected'
    );
  });
});

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PhoneCard from './PhoneCard';

const defaultProps = {
  id: 'SMG-S24U',
  name: 'Galaxy S24 Ultra',
  brand: 'Samsung',
  price: 1199,
  imageUrl: 'https://example.com/phone.jpg',
};

describe('PhoneCard', () => {
  it('renders name, brand and price', () => {
    render(
      <MemoryRouter>
        <PhoneCard {...defaultProps} />
      </MemoryRouter>
    );
    expect(screen.getByText('Galaxy S24 Ultra')).toBeInTheDocument();
    expect(screen.getByText('Samsung')).toBeInTheDocument();
    expect(screen.getByText('1199 EUR')).toBeInTheDocument();
  });

  it('link points to /phone/:id', () => {
    render(
      <MemoryRouter>
        <PhoneCard {...defaultProps} />
      </MemoryRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/phone/SMG-S24U');
  });
});

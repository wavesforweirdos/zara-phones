import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SimilarPhones from './SimilarPhones';
import type { PhoneSummary } from '../../types/phone';

const products: PhoneSummary[] = [
  { id: '1', name: 'Pixel 8', brand: 'Google', basePrice: 799, imageUrl: 'pixel.jpg' },
  { id: '2', name: 'iPhone 15', brand: 'Apple', basePrice: 1099, imageUrl: 'iphone.jpg' },
];

const renderSimilar = (items?: PhoneSummary[]) =>
  render(<SimilarPhones products={items} />, { wrapper: MemoryRouter });

describe('SimilarPhones', () => {
  it('renders one card per similar product', () => {
    renderSimilar(products);
    const list = screen.getByRole('list', { name: 'Productos similares' });
    expect(list.querySelectorAll('li')).toHaveLength(2);
  });

  it('renders nothing when there are no similar products', () => {
    const { container } = renderSimilar([]);
    expect(container).toBeEmptyDOMElement();
  });

  it('can switch between having and not having products without breaking hook order', () => {
    const { rerender, container } = renderSimilar(products);

    rerender(<SimilarPhones products={[]} />);
    expect(container).toBeEmptyDOMElement();

    rerender(<SimilarPhones products={products} />);
    expect(screen.getByRole('list', { name: 'Productos similares' })).toBeInTheDocument();
  });
});

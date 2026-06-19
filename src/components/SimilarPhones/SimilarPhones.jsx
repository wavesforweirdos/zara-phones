import PhoneCard from '../PhoneCard/PhoneCard';
import './SimilarPhones.scss';

function SimilarPhones({ products }) {
  if (!products?.length) return null;

  return (
    <section className="similar-phones">
      <h2 className="similar-phones__title">SIMILAR ITEMS</h2>
      <ul className="similar-phones__grid" aria-label="Productos similares">
        {products.map((phone) => (
          <li key={phone.id}>
            <PhoneCard
              id={phone.id}
              name={phone.name}
              brand={phone.brand}
              price={phone.basePrice}
              imageUrl={phone.imageUrl}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default SimilarPhones;

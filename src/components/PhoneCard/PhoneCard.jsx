import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PhoneCard.scss';

function PhoneCard({ id, name, brand, price, imageUrl }) {
  return (
    <Link to={`/phone/${id}`} className="phone-card" aria-label={`${brand} ${name}, ${price} EUR`}>
      <div className="phone-card__image-wrapper">
        <img
          src={imageUrl}
          alt={`${brand} ${name}`}
          className="phone-card__image"
          loading="lazy"
        />
      </div>
      <div className="phone-card__info">
        <div className="phone-card__text">
          <span className="phone-card__brand">{brand}</span>
          <span className="phone-card__name">{name}</span>
        </div>
        <span className="phone-card__price">{price} EUR</span>
      </div>
    </Link>
  );
}

PhoneCard.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  brand: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  imageUrl: PropTypes.string.isRequired,
};

export default PhoneCard;

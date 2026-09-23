import { Link } from 'react-router-dom';
import './PhoneCard.scss';

interface PhoneCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  imageUrl: string;
}

function PhoneCard({ id, name, brand, price, imageUrl }: PhoneCardProps) {
  return (
    <Link to={`/phone/${id}`} className="phone-card">
      <div className="phone-card__image-wrapper">
        <img src={imageUrl} alt={`${brand} ${name}`} className="phone-card__image" loading="lazy" />
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

export default PhoneCard;

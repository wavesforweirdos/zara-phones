import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import usePhone from '../../hooks/usePhone';
import { useCart } from '../../context/CartContext';
import StorageSelector from '../../components/StorageSelector/StorageSelector';
import ColorSelector from '../../components/ColorSelector/ColorSelector';
import SpecsTable from '../../components/SpecsTable/SpecsTable';
import SimilarPhones from '../../components/SimilarPhones/SimilarPhones';
import './PhoneDetailPage.scss';

function PhoneDetailPage() {
  const { id } = useParams();
  const { phone, loading, error } = usePhone(id);
  const { dispatch } = useCart();
  const navigate = useNavigate();

  const [selectedStorage, setSelectedStorage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  if (loading) {
    return (
      <main className="phone-detail-page container container--xl">
        <p className="phone-detail-page__status">Cargando...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="phone-detail-page container container--xl">
        <p className="phone-detail-page__status phone-detail-page__status--error">
          Error al cargar el teléfono.
        </p>
      </main>
    );
  }

  if (!phone) return null;

  const imageUrl = selectedColor?.imageUrl ?? phone.colorOptions?.[0]?.imageUrl;
  const price = selectedStorage ? `${selectedStorage.price} EUR` : `From ${phone.basePrice} EUR`;
  const canAdd = Boolean(selectedStorage && selectedColor);

  const handleAdd = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: phone.id,
        name: phone.name,
        brand: phone.brand,
        imageUrl: selectedColor.imageUrl,
        color: selectedColor.name,
        storage: selectedStorage.capacity,
        price: selectedStorage.price,
      },
    });
    navigate('/');
  };

  return (
    <main className="phone-detail-page container container--xl">
      <Link to="/" className="phone-detail-page__back">
        &lt; BACK
      </Link>

      <section className="phone-detail-page__product" aria-label="Información del producto">
        <div className="phone-detail-page__image-wrapper">
          <img
            src={imageUrl}
            alt={`${phone.brand} ${phone.name}`}
            className="phone-detail-page__image"
          />
        </div>

        <div className="phone-detail-page__info">
          <div className="phone-detail-page__header">
            <h1 className="phone-detail-page__name">{phone.name}</h1>
            <p className="phone-detail-page__price">{price}</p>
          </div>

          <div className="phone-detail-page__selectors">
            <StorageSelector
              options={phone.storageOptions}
              selected={selectedStorage}
              onChange={setSelectedStorage}
            />
            <ColorSelector
              options={phone.colorOptions}
              selected={selectedColor}
              onChange={setSelectedColor}
            />
          </div>

          <button
            type="button"
            className={`phone-detail-page__add-btn${!canAdd ? ' phone-detail-page__add-btn--disabled' : ''}`}
            disabled={!canAdd}
            onClick={handleAdd}
          >
            AÑADIR
          </button>
        </div>
      </section>

      <SpecsTable
        brand={phone.brand}
        name={phone.name}
        description={phone.description}
        specs={phone.specs}
      />

      <SimilarPhones products={phone.similarProducts} />
    </main>
  );
}

export default PhoneDetailPage;

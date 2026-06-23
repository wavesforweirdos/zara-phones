import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Button from '../../components/Button/Button';
import './CartPage.scss';

function CartPage() {
  const { cart, dispatch, cartTotal } = useCart();

  useEffect(() => {
    document.title = 'Carrito — Zara Phones';
    return () => {
      document.title = 'Zara Phones';
    };
  }, []);

  const handleRemove = (item) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id: item.id, color: item.color, storage: item.storage },
    });
  };

  const hasItems = cart.length > 0;

  return (
    <main id="main-content" className="cart-page">
      <div className="cart-page__content container container--xl">
        <h1 className="cart-page__title">CART ({cart.length})</h1>

        {!hasItems && <p className="sr-only">Tu carrito está vacío.</p>}

        {hasItems && (
          <ul className="cart-page__list">
            {cart.map((item) => (
              <li key={`${item.id}-${item.color}-${item.storage}`} className="cart-page__item">
                <Link
                  to={`/phone/${item.id}`}
                  className="cart-page__item-image-link"
                  aria-hidden="true"
                  tabIndex={-1}
                >
                  <img
                    src={item.imageUrl}
                    alt={`${item.brand} ${item.name}`}
                    className="cart-page__item-image"
                    loading="lazy"
                  />
                </Link>
                <div className="cart-page__item-body">
                  <div className="cart-page__item-details">
                    <Link to={`/phone/${item.id}`} className="cart-page__item-name">{item.name}</Link>
                    <p className="cart-page__item-specs">
                      {item.storage} | {item.color}
                    </p>
                    <p className="cart-page__item-price">{item.price} EUR</p>
                  </div>
                  <button
                    type="button"
                    className="cart-page__item-remove"
                    onClick={() => handleRemove(item)}
                    aria-label={`Eliminar ${item.brand} ${item.name}`}
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <footer className="cart-page__footer">
        <div className="cart-page__footer-inner container container--xl">
          {hasItems && (
            <div className="cart-page__total">
              <span className="cart-page__total-label">TOTAL</span>
              <span className="cart-page__total-amount">{cartTotal} EUR</span>
            </div>
          )}
          <Link to="/" className="btn btn--secondary cart-page__continue">
            CONTINUE SHOPPING
          </Link>
          {hasItems && (
            <Button variant="primary" className="cart-page__pay">
              PAY
            </Button>
          )}
        </div>
      </footer>
    </main>
  );
}

export default CartPage;

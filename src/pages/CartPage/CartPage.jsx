import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.scss';

function CartPage() {
  const { cart, dispatch, cartTotal } = useCart();

  const handleRemove = (item) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { id: item.id, color: item.color, storage: item.storage },
    });
  };

  if (cart.length === 0) {
    return (
      <main className="cart-page">
        <div className="container container--xl cart-page__empty-wrapper">
          <p className="cart-page__empty">No items yet</p>
        </div>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <div className="container container--xl">
        <ul className="cart-page__list">
          {cart.map((item) => (
            <li key={`${item.id}-${item.color}-${item.storage}`} className="cart-page__item">
              <img
                src={item.imageUrl}
                alt={`${item.brand} ${item.name}`}
                className="cart-page__item-image"
              />
              <div className="cart-page__item-body">
                <div className="cart-page__item-details">
                  <p className="cart-page__item-name">{item.name}</p>
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

        <div className="cart-page__footer">
          <div className="cart-page__total">
            <span className="cart-page__total-label">Total</span>
            <span className="cart-page__total-amount">{cartTotal} EUR</span>
          </div>
          <Link to="/" className="cart-page__cta">
            Continuar comprando
          </Link>
        </div>
      </div>
    </main>
  );
}

export default CartPage;

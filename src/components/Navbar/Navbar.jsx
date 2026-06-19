import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Navbar.scss';

function PhoneIcon() {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0.5" y="0.5" width="19" height="23" rx="2.5" stroke="#000000" />
      <circle cx="10" cy="20" r="1" fill="#000000" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="33"
      height="26"
      viewBox="0 0 33 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="0.5" y="7.5" width="32" height="18" stroke="#000000" strokeWidth="1" />
      <path
        d="M10 7.5V5.5C10 3.291 11.791 1.5 14 1.5H19C21.209 1.5 23 3.291 23 5.5V7.5"
        stroke="#000000"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="navbar" role="banner">
      <nav className="navbar__inner" aria-label="Navegación principal">
        <Link to="/" className="navbar__logo" aria-label="Ir a inicio">
          <PhoneIcon />
        </Link>

        <span className="navbar__title">CHALLENGE</span>

        <Link to="/cart" className="navbar__cart" aria-label={`Carrito, ${cartCount} artículos`}>
          <span className="navbar__cart-wrapper">
            <BagIcon />
            {cartCount > 0 && (
              <span className="navbar__badge" aria-hidden="true">
                {cartCount}
              </span>
            )}
          </span>
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;

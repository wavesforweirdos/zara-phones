import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo.svg';
import bag from '../../assets/bag.svg';
import './Navbar.scss';

function Navbar() {
  const { cartCount } = useCart();
  const { pathname } = useLocation();
  const isCart = pathname === '/cart';

  return (
    <header className={`navbar${isCart ? ' navbar--bordered' : ''}`} role="banner">
      <nav className="navbar__inner container container--xl" aria-label="Navegación principal">
        <Link to="/" className="navbar__logo" aria-label="Ir a inicio">
          <img src={logo} alt="Zara Challenge" className="navbar__logo-img" />
        </Link>

        {!isCart && (
          <Link to="/cart" className="navbar__cart" aria-label={`Carrito, ${cartCount} productos`}>
            <img src={bag} alt="" aria-hidden="true" className="navbar__bag-icon" />
            {cartCount >= 0 && <span className="navbar__cart-count">{cartCount}</span>}
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;

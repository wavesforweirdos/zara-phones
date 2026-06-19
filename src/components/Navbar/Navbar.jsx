import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import logo from '../../assets/logo.svg';
import bag from '../../assets/bag.svg';
import './Navbar.scss';

function Navbar() {
  const { cartCount } = useCart();

  return (
    <header className="navbar" role="banner">
      <nav className="navbar__inner" aria-label="Navegación principal">
        <Link to="/" className="navbar__logo" aria-label="Ir a inicio">
          <img src={logo} alt="Zara Challenge" className="navbar__logo-img" />
        </Link>

        <Link
          to="/cart"
          className="navbar__cart"
          aria-label={`Carrito, ${cartCount} productos`}
        >
          <img src={bag} alt="" aria-hidden="true" className="navbar__bag-icon" />
          {cartCount >= 0 && <span className="navbar__cart-count">{cartCount}</span>}
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;

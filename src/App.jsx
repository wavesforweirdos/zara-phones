import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PhoneListPage from './pages/PhoneListPage/PhoneListPage';
import PhoneDetailPage from './pages/PhoneDetailPage/PhoneDetailPage';
import CartPage from './pages/CartPage/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PhoneListPage />} />
        <Route path="/phone/:id" element={<PhoneDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import PhoneListPage from './pages/PhoneListPage/PhoneListPage';
import PhoneDetailPage from './pages/PhoneDetailPage/PhoneDetailPage';
import CartPage from './pages/CartPage/CartPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<PhoneListPage />} />
        <Route path="/phone/:id" element={<PhoneDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

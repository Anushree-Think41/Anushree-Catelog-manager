import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import ProductCatalogPage from './pages/ProductCatalogPage';
import UploadAndListProductsPage from './pages/UploadAndListProductsPage';
import OptimizePage from './pages/OptimizePage';
import OptimizeProductsPage from './pages/OptimizeProductsPage';
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<Layout><UploadAndListProductsPage /></Layout>} />
        <Route path="/products" element={<Layout><ProductCatalogPage /></Layout>} />
        <Route path="/optimize" element={<Layout><OptimizePage /></Layout>} />
        <Route path="/optimize-products" element={<Layout><OptimizeProductsPage /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;

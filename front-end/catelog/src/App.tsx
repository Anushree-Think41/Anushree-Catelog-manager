import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import ProductCatalogPage from './pages/ProductCatalogPage';
import UploadAndListProductsPage from './pages/UploadAndListProductsPage';
import OptimizePage from './pages/OptimizePage';
import OptimizeProductsPage from './pages/OptimizeProductsPage';
import LandingPage from './pages/LandingPage';
import CategoryPage from './pages/CategoryPage';
import SEOFocusPage from './pages/SEOFocusPage';
import WritingTonePage from './pages/WritingTonePage';
import OptimizationSuccessPage from './pages/OptimizationSuccessPage';
import ProductInsightsPage from './pages/ProductInsightsPage';
import AgentPlaygroundPage from './pages/AgentPlaygroundPage'; // Import AgentPlaygroundPage
import ProductComparisonPage from './pages/ProductComparisonPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/category" element={<CategoryPage />} />
        <Route path="/seo-focus" element={<SEOFocusPage />} />
        <Route path="/writing-tone" element={<WritingTonePage />} />
        <Route path="/optimization-success" element={<OptimizationSuccessPage />} />
        <Route path="/upload" element={<Layout><UploadAndListProductsPage /></Layout>} />
        <Route path="/product-catalog" element={<Layout><ProductCatalogPage /></Layout>} />
        <Route path="/optimize" element={<Layout><OptimizePage /></Layout>} />
        <Route path="/optimize-products" element={<Layout><OptimizeProductsPage /></Layout>} />
        <Route path="/product-insights/:productId" element={<Layout><ProductInsightsPage /></Layout>} />
        <Route path="/product-comparison/:productId" element={<Layout><ProductComparisonPage /></Layout>} />
        <Route path="/agent-playground" element={<Layout><AgentPlaygroundPage /></Layout>} /> {/* New route for AgentPlaygroundPage */}
      </Routes>
    </Router>
  );
}

export default App;

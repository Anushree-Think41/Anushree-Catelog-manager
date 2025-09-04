import React from 'react';
import { useNavigate } from 'react-router-dom';

const OptimizationSuccessPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToCatalog = () => {
    navigate('/product-catalog');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-10">
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-5xl mx-auto mb-6">
          ✓
        </div>
        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Optimization Started!</h2>
        <p className="text-gray-600 mb-8">
          Your products are now being optimized. This process may take a few minutes. You can monitor the progress in your product catalog.
        </p>
        <button
          onClick={handleGoToCatalog}
          className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
        >
          Go to Product Catalog
        </button>
      </div>
    </div>
  );
};

export default OptimizationSuccessPage;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetupStore } from '../store/setupStore';

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const setCategory = useSetupStore((state) => state.setCategory);

  const handleNext = () => {
    setCategory(selectedCategory);
    navigate('/seo-focus');
  };

  const handlePrevious = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Progress Indicator */}
      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg mb-12">
        <div className="flex justify-around mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">✓</div>
            <p className="text-sm text-gray-600">Store URL</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2">2</div>
            <p className="text-sm text-gray-600">Category</p>
          </div>
          <div className="text-center opacity-50">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold mb-2">3</div>
            <p className="text-sm text-gray-600">SEO Focus</p>
          </div>
          <div className="text-center opacity-50">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold mb-2">4</div>
            <p className="text-sm text-gray-600">Writing Tone</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 text-3xl mx-auto mb-4">📦</div> {/* Placeholder icon */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">What kind of products are you optimizing today?</h2>
          <p className="text-gray-600">
            Choose your primary product category to get tailored optimization strategies
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">Product Category <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-3 gap-4">
            {/* Category Options */}
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">📱</div>
              <p className="text-gray-700 font-medium">Electronics</p>
              <input type="radio" name="category" value="Electronics" checked={selectedCategory === 'Electronics'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">👗</div>
              <p className="text-gray-700 font-medium">Fashion</p>
              <input type="radio" name="category" value="Fashion" checked={selectedCategory === 'Fashion'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">🏠</div>
              <p className="text-gray-700 font-medium">Home & Decor</p>
              <input type="radio" name="category" value="Home & Decor" checked={selectedCategory === 'Home & Decor'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">💄</div>
              <p className="text-gray-700 font-medium">Beauty</p>
              <input type="radio" name="category" value="Beauty" checked={selectedCategory === 'Beauty'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">🏋️</div>
              <p className="text-gray-700 font-medium">Sports</p>
              <input type="radio" name="category" value="Sports" checked={selectedCategory === 'Sports'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">📚</div>
              <p className="text-gray-700 font-medium">Books</p>
              <input type="radio" name="category" value="Books" checked={selectedCategory === 'Books'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">🧸</div>
              <p className="text-gray-700 font-medium">Toys</p>
              <input type="radio" name="category" value="Toys" checked={selectedCategory === 'Toys'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">🚗</div>
              <p className="text-gray-700 font-medium">Automotive</p>
              <input type="radio" name="category" value="Automotive" checked={selectedCategory === 'Automotive'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">💎</div>
              <p className="text-gray-700 font-medium">Jewelry</p>
              <input type="radio" name="category" value="Jewelry" checked={selectedCategory === 'Jewelry'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">➕</div>
              <p className="text-gray-700 font-medium">Other</p>
              <input type="radio" name="category" value="Other" checked={selectedCategory === 'Other'} onChange={(e) => setSelectedCategory(e.target.value)} className="mt-2" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={handlePrevious} className="text-gray-500 flex items-center">
            <span className="mr-2">←</span> Previous
          </button>
          <span className="text-gray-500">Step 2 of 4</span>
          <button onClick={handleNext} disabled={!selectedCategory} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center">
            Next <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;

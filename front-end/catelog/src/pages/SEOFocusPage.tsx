import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetupStore } from '../store/setupStore';

const SEOFocusPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedSeoFocus, setSelectedSeoFocus] = useState<string>('');
  const setSeoFocus = useSetupStore((state) => state.setSeoFocus);

  const handleNext = () => {
    setSeoFocus(selectedSeoFocus);
    navigate('/writing-tone');
  };

  const handlePrevious = () => {
    navigate('/category');
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
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">✓</div>
            <p className="text-sm text-gray-600">Category</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2">3</div>
            <p className="text-sm text-gray-600">SEO Focus</p>
          </div>
          <div className="text-center opacity-50">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold mb-2">4</div>
            <p className="text-sm text-gray-600">Writing Tone</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-200 rounded-full flex items-center justify-center text-green-800 text-3xl mx-auto mb-4">🎯</div> {/* Placeholder icon */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">What's your primary SEO focus?</h2>
          <p className="text-gray-600">
            Select your main optimization goal to customize our approach
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">SEO Focus Area <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-4">
            {/* SEO Focus Options */}
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">📈</div>
              <p className="text-gray-700 font-medium">Search Ranking</p>
              <input type="radio" name="seoFocus" value="Search Ranking" checked={selectedSeoFocus === 'Search Ranking'} onChange={(e) => setSelectedSeoFocus(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">💰</div>
              <p className="text-gray-700 font-medium">Conversion</p>
              <input type="radio" name="seoFocus" value="Conversion" checked={selectedSeoFocus === 'Conversion'} onChange={(e) => setSelectedSeoFocus(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">🗣️</div>
              <p className="text-gray-700 font-medium">Brand Voice</p>
              <input type="radio" name="seoFocus" value="Brand Voice" checked={selectedSeoFocus === 'Brand Voice'} onChange={(e) => setSelectedSeoFocus(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">⚔️</div>
              <p className="text-gray-700 font-medium">Competitor Match</p>
              <input type="radio" name="seoFocus" value="Competitor Match" checked={selectedSeoFocus === 'Competitor Match'} onChange={(e) => setSelectedSeoFocus(e.target.value)} className="mt-2" />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button onClick={handlePrevious} className="text-gray-500 flex items-center">
            <span className="mr-2">←</span> Previous
          </button>
          <span className="text-gray-500">Step 3 of 4</span>
          <button onClick={handleNext} disabled={!selectedSeoFocus} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center">
            Next <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SEOFocusPage;

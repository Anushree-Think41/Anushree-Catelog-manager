import React, { useState } from 'react';
import { Line } from 'rc-progress';
import { useNavigate } from 'react-router-dom';
import { useSetupStore } from '../store/setupStore';

const WritingTonePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedWritingTone, setSelectedWritingTone] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const setWritingTone = useSetupStore((state) => state.setWritingTone);
  const getAllSelections = useSetupStore((state) => state.getAllSelections);

  const handleStartOptimization = async () => {
    setWritingTone(selectedWritingTone);
    const allSelections = getAllSelections();
    setIsLoading(true); // Start loading

    try {
      // Step 1: Sync products from Shopify
      console.log('Syncing products from Shopify...');
      const syncResponse = await fetch('http://localhost:8000/shopify/shopify/sync', {
        method: 'POST',
      });

      if (!syncResponse.ok) {
        console.error('Failed to sync products from Shopify:', syncResponse.status, await syncResponse.text());
        // Optionally show an error message to the user
        setIsLoading(false); // Stop loading on sync failure
        return;
      }
      console.log('Shopify products synced successfully. Starting optimization...');

      // Step 2: Start optimization of all products
      const response = await fetch('http://localhost:8000/optimize/all-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(allSelections),
      });

      if (response.ok) {
        console.log('Optimization started successfully!', await response.json());
        navigate('/optimization-success'); // Navigate to success page
      } else {
        console.error('Failed to start optimization:', response.status, await response.text());
        // Optionally show an error message to the user
      }
    } catch (error) {
      console.error('Error sending optimization request:', error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handlePrevious = () => {
    navigate('/seo-focus');
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
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-bold mb-2">✓</div>
            <p className="text-sm text-gray-600">SEO Focus</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2">4</div>
            <p className="text-sm text-gray-600">Writing Tone</p>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-purple-800 text-3xl mx-auto mb-4">✍️</div> {/* Placeholder icon */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">How should we write your content?</h2>
          <p className="text-gray-600">
            Choose the writing tone that best matches your brand personality
          </p>
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">Writing Tone <span className="text-red-500">*</span></label>
          <div className="grid grid-cols-2 gap-4">
            {/* Writing Tone Options */}
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">👔</div>
              <p className="text-gray-700 font-medium">Formal</p>
              <input type="radio" name="writingTone" value="Formal" checked={selectedWritingTone === 'Formal'} onChange={(e) => setSelectedWritingTone(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">👕</div>
              <p className="text-gray-700 font-medium">Casual</p>
              <input type="radio" name="writingTone" value="Casual" checked={selectedWritingTone === 'Casual'} onChange={(e) => setSelectedWritingTone(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">👑</div>
              <p className="text-gray-700 font-medium">Luxury</p>
              <input type="radio" name="writingTone" value="Luxury" checked={selectedWritingTone === 'Luxury'} onChange={(e) => setSelectedWritingTone(e.target.value)} className="mt-2" />
            </div>
            <div className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center text-center border border-gray-200">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-2xl mb-2">✨</div>
              <p className="text-gray-700 font-medium">Minimalist</p>
              <input type="radio" name="writingTone" value="Minimalist" checked={selectedWritingTone === 'Minimalist'} onChange={(e) => setSelectedWritingTone(e.target.value)} className="mt-2" />
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="text-center mt-8">
            <p className="text-lg font-semibold text-blue-600 mb-4">Optimizing your products...</p>
            <Line percent={50} strokeWidth={4} strokeColor="#4299e1" className="w-full" />
          </div>
        )}

        <div className="flex justify-between items-center mt-8">
          <button onClick={handlePrevious} className="text-gray-500 flex items-center" disabled={isLoading}>
            <span className="mr-2">←</span> Previous
          </button>
          <span className="text-gray-500">Step 4 of 4</span>
          <button onClick={handleStartOptimization} disabled={!selectedWritingTone || isLoading} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center">
            Start Optimization <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingTonePage;

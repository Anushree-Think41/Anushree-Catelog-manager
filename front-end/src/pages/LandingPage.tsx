import React from 'react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center items-center mb-4">
          <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-2xl">📦</div> {/* Placeholder icon */}
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Catalog Manager Agent</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform your Shopify product listings with AI-powered optimization. Boost rankings,
          increase conversions, and maintain brand consistency across your entire catalog.
        </p>
        <div className="mt-6 flex justify-center space-x-4">
          <button className="bg-blue-200 text-blue-800 px-6 py-2 rounded-full flex items-center">
            <span className="mr-2">✨</span> AI-Powered
          </button>
          <button className="bg-purple-200 text-purple-800 px-6 py-2 rounded-full flex items-center">
            <span className="mr-2">🚀</span> Advanced Technology
          </button>
        </div>
      </div>

      {/* Shopify Store URL Section */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl mb-12">
        <div className="flex justify-around mb-8">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-2">1</div>
            <p className="text-sm text-gray-600">Store URL</p>
          </div>
          <div className="text-center opacity-50">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 font-bold mb-2">2</div>
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
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Let's start with your Shopify store</h2>
          <p className="text-gray-600">
            Enter your store URL so we can analyze and optimize your product catalog
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="shopify-url" className="block text-sm font-medium text-gray-700 mb-1">
            Shopify Store URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="shopify-url"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://your-store.myshopify.com"
          />
        </div>

        <div className="flex justify-between items-center">
          <button className="text-gray-500 flex items-center">
            <span className="mr-2">←</span> Previous
          </button>
          <span className="text-gray-500">Step 1 of 4</span>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 flex items-center">
            Next <span className="ml-2">→</span>
          </button>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Why Choose Our Catalog Manager?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="text-green-500 text-4xl mb-4">🔍</span> {/* Placeholder icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">SEO Optimization</h3>
            <p className="text-gray-600">
              Improve search rankings with keyword-rich product descriptions and meta tags.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="text-orange-500 text-4xl mb-4">📈</span> {/* Placeholder icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Conversion Focus</h3>
            <p className="text-gray-600">
              Optimize product copy to drive more sales and reduce bounce rates.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="text-purple-500 text-4xl mb-4">🗣️</span> {/* Placeholder icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Brand Voice</h3>
            <p className="text-gray-600">
              Maintain consistent brand messaging across all product listings.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
            <span className="text-blue-500 text-4xl mb-4">🎯</span> {/* Placeholder icon */}
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Competitor Analysis</h3>
            <p className="text-gray-600">
              Stay ahead with insights from competitor product descriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

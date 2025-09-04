import React from 'react';

const OptimizePage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Optimize</h1>
      <p className="text-lg text-gray-600 mb-8">AI-powered optimization tools for your product listings</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Title Optimization */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-blue-500 text-3xl mr-3">⚡️</span>
              <h2 className="text-xl font-semibold text-gray-800">AI Title Optimization</h2>
            </div>
            <p className="text-gray-600 mb-4">Generate compelling, SEO-optimized titles that drive more clicks and conversions.</p>
          </div>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">Start Optimizing</button>
        </div>

        {/* Description Enhancement */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-purple-500 text-3xl mr-3">✍️</span>
              <h2 className="text-xl font-semibold text-gray-800">Description Enhancement</h2>
            </div>
            <p className="text-gray-600 mb-4">Improve product descriptions with AI-powered suggestions for better engagement.</p>
          </div>
          <button className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition duration-300">Enhance Descriptions</button>
        </div>

        {/* Bulk Optimization */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-orange-500 text-3xl mr-3">📦</span>
              <h2 className="text-xl font-semibold text-gray-800">Bulk Optimization</h2>
            </div>
            <p className="text-gray-600 mb-4">Apply optimization suggestions to multiple products at once for maximum efficiency.</p>
          </div>
          <button className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-700 transition duration-300">Bulk Optimize</button>
        </div>

        {/* Keyword Optimization */}
        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-4">
              <span className="text-green-500 text-3xl mr-3">🔑</span>
              <h2 className="text-xl font-semibold text-gray-800">Keyword Optimization</h2>
            </div>
            <p className="text-gray-600 mb-4">Discover and integrate high-ranking keywords to improve product visibility and search performance.</p>
          </div>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition duration-300">Optimize Keywords</button>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mt-10 mb-4">Recent Optimizations</h2>
      <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
        No recent optimizations. Start optimizing your products to see results here.
      </div>
    </div>
  );
};

export default OptimizePage;

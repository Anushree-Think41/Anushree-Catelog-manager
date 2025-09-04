import React, { useEffect, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { updateProductOnShopify } from '../api/productService'; // Import the new function

interface ComparisonMetric {
  original: number;
  optimized: number;
  insight: string;
}

interface ComparisonData {
  seo_keyword_richness: ComparisonMetric;
  clarity_readability: ComparisonMetric;
  persuasiveness: ComparisonMetric;
  uniqueness: ComparisonMetric;
  best_practices: ComparisonMetric;
}

interface OverallScore {
  original: number;
  optimized: number;
  insight: string;
}

interface ProductComparisonResponse {
  optimized_product_id: number;
  comparison: {
    comparison: ComparisonData;
    overall_score: OverallScore;
    conclusion: string;
  };
}

interface ProductDetails {
  title: string;
  description: string;
  price: number;
  sku: string;
  tags: string;
}

interface ProductDetailsResponse {
  original_product: ProductDetails;
  optimized_product: ProductDetails;
}

const ProductComparisonPage: React.FC = () => {
  const { optimizedProductId } = useParams<{ optimizedProductId: string }>();
  const [comparisonData, setComparisonData] = useState<ProductComparisonResponse | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingShopify, setIsUpdatingShopify] = useState<boolean>(false); // New state for Shopify update loading
  const [updateMessage, setUpdateMessage] = useState<string | null>(null); // New state for update messages

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [comparisonResponse, detailsResponse] = await Promise.all([
          axios.get<ProductComparisonResponse>(`http://localhost:8000/api/product-comparison/${optimizedProductId}`),
          axios.get<ProductDetailsResponse>(`http://localhost:8000/api/product-details/${optimizedProductId}`),
        ]);
        setComparisonData(comparisonResponse.data);
        setProductDetails(detailsResponse.data);
      } catch (err) {
        setError('Failed to fetch data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (optimizedProductId) {
      fetchData();
    }
  }, [optimizedProductId]);

  const handleUpdateToShopify = async () => {
    if (!optimizedProductId) {
      setUpdateMessage('No optimized product ID available to update.');
      return;
    }

    setIsUpdatingShopify(true);
    setUpdateMessage(null);
    try {
      await updateProductOnShopify(optimizedProductId);
      setUpdateMessage('Product successfully updated on Shopify!');
    } catch (err) {
      setUpdateMessage('Failed to update product on Shopify.');
      console.error('Error updating to Shopify:', err);
    } finally {
      setIsUpdatingShopify(false);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>;
  }

  // AI SDK UI Chat Integration (Commented out for debugging)
  // const { messages, input, handleInputChange, handleSubmit } = useChat({
  //   api: 'http://localhost:8000/chat', // Replace with your backend URL if different
  // });

  if (!comparisonData || !productDetails) {
    return <div className="flex h-screen items-center justify-center">No data found.</div>;
  }

  const { comparison, overall_score, conclusion } = comparisonData.comparison;
  const { original_product, optimized_product } = productDetails;

  const chartData = Object.entries(comparison).map(([key, value]) => ({
    name: key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase()),
    original: value.original,
    optimized: value.optimized,
  }));

  const pieChartData = [
    { name: 'Original', value: overall_score.original },
    { name: 'Optimized', value: overall_score.optimized },
  ];

  const COLORS = ['#FF8042', '#0088FE'];

  return (
    // <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Comparison</h1>
        <p className="text-gray-600 mb-6">Compare original vs optimized product listings to maximize SEO impact and conversion potential.</p>

        <button
          onClick={handleUpdateToShopify}
          disabled={isUpdatingShopify || !optimizedProductId}
          className={`mb-4 px-6 py-3 rounded-lg font-semibold transition duration-300
            ${isUpdatingShopify ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {isUpdatingShopify ? 'Updating to Shopify...' : 'Update to Shopify'}
        </button>

        {updateMessage && (
          <div className={`mb-4 p-3 rounded-md ${updateMessage.includes('successfully') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {updateMessage}
          </div>
        )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Original Product</h3>
          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-xs">Title:</p>
              <p className="font-medium text-gray-900">{original_product.title}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">Description:</p>
              <p className="text-gray-700 text-sm" dangerouslySetInnerHTML={{ __html: original_product.description }}></p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-xs">Price:</p>
                <p className="font-medium text-gray-900">${original_product.price}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-500 text-xs">SKU:</p>
                <p className="font-medium text-gray-900">{original_product.sku}</p>
              </div>
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-1">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {original_product.tags.split(',').map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-700 mb-4">Optimized Product</h3>
          <div className="space-y-3">
            <div>
              <p className="text-blue-500 text-xs">Title:</p>
              <p className="font-medium text-blue-900">{optimized_product.title}</p>
            </div>
            <div>
              <p className="text-blue-500 text-xs">Description:</p>
              <p className="text-blue-700 text-sm" dangerouslySetInnerHTML={{ __html: optimized_product.description }}></p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-blue-500 text-xs">Price:</p>
                <p className="font-medium text-blue-900">${optimized_product.price}</p>
              </div>
              <div className="text-right">
                <p className="text-blue-500 text-xs">SKU:</p>
                <p className="font-medium text-blue-900">{optimized_product.sku}</p>
              </div>
            </div>
            <div>
              <p className="text-blue-500 text-xs mb-1">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {optimized_product.tags.split(',').map((tag, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Comparison Metrics</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Score</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimized Score</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insight</th>
                <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(comparison).map(([key, value]) => {
                const metricName = key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
                const scoreDifference = value.optimized - value.original;
                const scoreDifferenceText = scoreDifference > 0 ? `(+${scoreDifference})` : `(${scoreDifference})`;
                const scoreDifferenceColorClass = scoreDifference > 0 ? 'text-green-600' : 'text-red-600';

                return (
                  <tr key={key}>
                    <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{metricName}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-orange-100 text-orange-800">
                        {value.original}
                      </span>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {value.optimized}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 max-w-xs break-words">{value.insight}</td>
                    <td className={`px-4 py-2 whitespace-nowrap text-sm font-medium ${scoreDifferenceColorClass}`}>
                      {scoreDifferenceText}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Comparison Metrics Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="original" fill="#FF8042" name="Original" />
              <Bar dataKey="optimized" fill="#0088FE" name="Optimized" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-500 text-xs mt-2">Score Range: 0-100</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Overall SEO Impact</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-center text-gray-600 mt-4">
            <span className="font-semibold text-orange-500">Original: {overall_score.original}%</span>
            <span className="mx-2">|</span>
            <span className="font-semibold text-blue-500">Optimized: {overall_score.optimized}%</span>
          </p>
        </div>
      </div>

      <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Conclusion</h3>
        <p className="text-gray-700 mb-4">{conclusion}</p>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
          <h4 className="font-semibold text-gray-800 mb-2">Key Improvements:</h4>
          <ul className="list-disc list-inside text-gray-700">
            <li>Enhanced keyword density for better search visibility</li>
            <li>Improved readability and clarity for better user experience</li>
            <li>Stronger persuasive language to increase conversion rates</li>
            <li>Better adherence to SEO best practices</li>
          </ul>
        </div>
      </div>

      {/* AI SDK UI Chat Integration */}
      {/* <div className="chat-container mt-8 p-6 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Chat with AI Assistant</h3>
        <div className="messages max-h-60 overflow-y-auto mb-4 p-2 border rounded-md bg-white">
          {messages.map(m => (
            <div key={m.id} className={`mb-2 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block p-2 rounded-lg ${m.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
                <strong>{m.role === 'user' ? 'You: ' : 'AI: '}
                </strong>{m.content}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Say something..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Send
          </button>
        </form>
      </div> */}

    </div>
    // </div>
  );
};

export default ProductComparisonPage;
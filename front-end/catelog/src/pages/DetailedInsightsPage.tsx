import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

const DetailedInsightsPage: React.FC = () => {
  const { optimizedProductId } = useParams<{ optimizedProductId: string }>();
  const [comparisonData, setComparisonData] = useState<ProductComparisonResponse | null>(null);
  const [productDetails, setProductDetails] = useState<ProductDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading detailed insights...</div>;
  }

  if (error) {
    return <div className="flex h-screen items-center justify-center text-red-500">Error: {error}</div>;
  }

  if (!comparisonData || !productDetails) {
    return <div className="flex h-screen items-center justify-center">No detailed insights found.</div>;
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
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Detailed Product Insights for Optimized Product ID: {optimizedProductId}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Original Product Details</h3>
          <div className="border p-4 rounded-lg bg-gray-50">
            <p className="mb-1"><strong>Title:</strong> {original_product.title}</p>
            <p className="mb-1"><strong>Description:</strong> {original_product.description}</p>
            <p className="mb-1"><strong>Price:</strong> ${original_product.price}</p>
            <p className="mb-1"><strong>SKU:</strong> {original_product.sku}</p>
            <p><strong>Tags:</strong> {original_product.tags}</p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Optimized Product Details</h3>
          <div className="border p-4 rounded-lg bg-blue-50">
            <p className="mb-1"><strong>Title:</strong> {optimized_product.title}</p>
            <p className="mb-1"><strong>Description:</strong> {optimized_product.description}</p>
            <p className="mb-1"><strong>Price:</strong> ${optimized_product.price}</p>
            <p className="mb-1"><strong>SKU:</strong> {optimized_product.sku}</p>
            <p><strong>Tags:</strong> {optimized_product.tags}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Comparison Metrics Overview</h3>
        <div className="overflow-x-auto mb-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metric</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Original Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Optimized Score</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Insight</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(comparison).map(([key, value]) => (
                <tr key={key}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase())}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value.original}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value.optimized}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-md break-words">{value.insight}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-gray-700">
          <strong>Overall Optimization Conclusion:</strong> {conclusion}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Metric Scores Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="original" fill="#FF8042" name="Original Score" />
              <Bar dataKey="optimized" fill="#0088FE" name="Optimized Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Overall SEO Impact Score</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-gray-700 text-center mt-3">
            <strong>Insight:</strong> {overall_score.insight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DetailedInsightsPage;
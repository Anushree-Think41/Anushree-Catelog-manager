import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

const ProductComparisonPage: React.FC = () => {
  const { optimizedProductId } = useParams<{ optimizedProductId: string }>();
  const [comparisonData, setComparisonData] = useState<ProductComparisonResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<ProductComparisonResponse>(
          `http://localhost:8000/api/product-comparison/${optimizedProductId}`
        );
        setComparisonData(response.data);
      } catch (err) {
        setError('Failed to fetch product comparison data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (optimizedProductId) {
      fetchComparisonData();
    }
  }, [optimizedProductId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading comparison data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Error: {error}
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="flex h-screen items-center justify-center">
        No comparison data found.
      </div>
    );
  }

  const { comparison, overall_score, conclusion } = comparisonData.comparison;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Product Comparison for Optimized Product ID: {optimizedProductId}</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Comparison Metrics</h3>
        <div className="overflow-x-auto">
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
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Overall SEO Impact Score</h3>
        <p className="text-gray-700">
          Original: <span className="font-bold">{overall_score.original}</span>, 
          Optimized: <span className="font-bold">{overall_score.optimized}</span>
        </p>
        <p className="text-gray-700">Insight: {overall_score.insight}</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">Conclusion</h3>
        <p className="text-gray-700">{conclusion}</p>
      </div>
    </div>
  );
};

export default ProductComparisonPage;
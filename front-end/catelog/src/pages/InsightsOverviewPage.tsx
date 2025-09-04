import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface OverallSummary {
  average_original_overall_score: number;
  average_optimized_overall_score: number;
  compared_products_count: number;
  message?: string;
}

const InsightsOverviewPage: React.FC = () => {
  const [overallSummary, setOverallSummary] = useState<OverallSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOverallSummary = async () => {
      try {
        setLoading(true);
        const response = await axios.get<OverallSummary>('http://localhost:8000/api/overall-product-comparison-summary');
        setOverallSummary(response.data);
      } catch (err) {
        setError('Failed to fetch overall insights summary.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverallSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading overall insights...
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

  if (!overallSummary || overallSummary.compared_products_count === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        No overall insights data found or no products compared yet.
      </div>
    );
  }

  const chartData = [
    { name: 'Average Scores', Original: overallSummary.average_original_overall_score, Optimized: overallSummary.average_optimized_overall_score }
  ];

  const pieChartData = [
    { name: 'Original', value: overallSummary.average_original_overall_score },
    { name: 'Optimized', value: overallSummary.average_optimized_overall_score },
  ];

  const COLORS = ['#FF8042', '#0088FE'];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Overall Catalog Insights Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-xl font-semibold mb-3">Average Optimization Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="Original" fill="#FF8042" />
              <Bar dataKey="Optimized" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-gray-700 text-center mt-3">
            These scores represent the average performance across {overallSummary.compared_products_count} optimized products.
          </p>
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-3">Overall Score Distribution</h3>
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
            Visual representation of average original vs. optimized scores.
          </p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-3">Key Takeaways</h3>
        <p className="text-gray-700">
          The overall optimization efforts have resulted in an average original score of <strong>{overallSummary.average_original_overall_score}</strong> and an average optimized score of <strong>{overallSummary.average_optimized_overall_score}</strong> across {overallSummary.compared_products_count} products. This indicates a general improvement in product quality and SEO performance after optimization. Further detailed insights can be found by viewing individual product comparisons.
        </p>
      </div>
    </div>
  );
};

export default InsightsOverviewPage;
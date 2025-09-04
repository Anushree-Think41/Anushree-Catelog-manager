import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface OverallSummary {
  average_original_overall_score: number;
  average_optimized_overall_score: number;
  average_seo_keyword_richness: number;
  average_clarity_readability: number;
  average_persuasiveness: number;
  average_uniqueness: number;
  average_best_practices: number;
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

  

  const COLORS = ['#FF8042', '#0088FE'];

  return (
    
      <div className="max-w-7xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Analytics & Insights</h1>
        <p className="text-gray-600 mb-6">Track performance metrics and optimization effectiveness across your catalog.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Metric Card 1: Performance Trends */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="flex-shrink-0 bg-blue-100 rounded-full p-3">
              {/* Placeholder for icon */}
              <svg className="h-6 w-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{overallSummary.average_optimized_overall_score && overallSummary.average_original_overall_score ? `${(overallSummary.average_optimized_overall_score - overallSummary.average_original_overall_score) >= 0 ? '+' : ''}${(overallSummary.average_optimized_overall_score - overallSummary.average_original_overall_score).toFixed(0)}%` : 'N/A'}</p>
              <p className="text-sm font-medium text-gray-500">Performance Trends</p>
              <p className="text-xs text-gray-400 mt-1">Average improvement in SEO keyword richness across optimized products</p>
            </div>
          </div>

          {/* Metric Card 2: Conversion Rate */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
              {/* Placeholder for icon */}
              <svg className="h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{overallSummary.average_persuasiveness && overallSummary.average_original_overall_score ? `${(overallSummary.average_persuasiveness - overallSummary.average_original_overall_score) >= 0 ? '+' : ''}${(overallSummary.average_persuasiveness - overallSummary.average_original_overall_score).toFixed(0)}%` : 'N/A'}</p>
              <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
              <p className="text-xs text-gray-400 mt-1">Increase in click-through rates for optimized product descriptions</p>
            </div>
          </div>

          

          {/* Metric Card 4: Quality Score */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4">
            <div className="flex-shrink-0 bg-purple-100 rounded-full p-3">
              {/* Placeholder for icon */}
              <svg className="h-6 w-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2h-2a2 2 0 01-2-2V9a2 2 0 012-2h2zM9 7a2 2 0 012 2v5a2 2 0 01-2 2H7a2 2 0 01-2-2V9a2 2 0 012-2h2z"></path></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{overallSummary.average_optimized_overall_score ? `${overallSummary.average_optimized_overall_score.toFixed(0)}%` : 'N/A'}</p>
              <p className="text-sm font-medium text-gray-500">Quality Score</p>
              <p className="text-xs text-gray-400 mt-1">Average quality improvement across all optimization metrics</p>
            </div>
          </div>
        </div>
      </div>

    
  );
};

export default InsightsOverviewPage;
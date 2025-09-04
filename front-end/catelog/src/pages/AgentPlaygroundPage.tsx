import React, { useState } from 'react';
import axios from 'axios';

const AgentPlaygroundPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse('');

    try {
      const res = await axios.post('http://localhost:8000/api/agent-playground', { query });
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setError('Failed to get agent response.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Agent Playground (Root Agent)</h1>

      <div className="mb-4">
        <label htmlFor="agentQuery" className="block text-sm font-medium text-gray-700 mb-2">
          Enter your query for the Root Agent:
        </label>
        <textarea
          id="agentQuery"
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
          value={query}
          onChange={handleQueryChange}
          placeholder="e.g., Perform a Google search for 'latest smartphone models' and summarize the top 3 results."
        ></textarea>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading || !query.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
      >
        {loading ? 'Sending Query...' : 'Get Agent Response'}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      {response && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Agent Response:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto text-sm">
            {response}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AgentPlaygroundPage;


import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { uploadProducts } from '../api/productService';

const UploadAndListProductsPage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file to upload.');
      return;
    }

    try {
      setMessage('Uploading...');
      await uploadProducts(selectedFile);
      setMessage('File uploaded successfully!');
      setSelectedFile(null);
      navigate('/products'); // Navigate to ProductCatalogPage after successful upload
    } catch (error) {
      setMessage('Upload failed.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-10">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Catalog Manager</h1>
      <p className="text-lg text-gray-600 text-center mb-10 max-w-2xl">
        Upload your product catalog to get started with AI-powered optimization and insights
      </p>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg mb-8">
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              setSelectedFile(e.dataTransfer.files[0]);
            }
          }}
        >
          <p className="text-xl font-semibold text-gray-700 mb-2">Drop your CSV file here</p>
          <p className="text-gray-500 mb-4">or click to browse and select your product catalog</p>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label
            htmlFor="csv-upload"
            className="cursor-pointer bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Choose File
          </label>
          {selectedFile && (
            <p className="mt-4 text-gray-700">Selected file: {selectedFile.name}</p>
          )}
          {message && <p className="mt-3 text-sm text-gray-700">{message}</p>}
        </div>

        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-75 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300"
        >
          Upload and Optimize
        </button>
      </div>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg mb-8">
        <div className="flex items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Need a template?</h2>
        </div>
        <p className="text-gray-600 mb-4">
          Download our CSV template with the correct format and sample data
        </p>
        <a
          href="../src/assets/catalog-template.csv" // Placeholder for template download
          download
          className="text-blue-600 hover:underline text-lg font-medium"
        >
          Download Template
        </a>
      </div>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">CSV Format Requirements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Required Columns:</h3>
            <ul className="list-disc list-inside">
              <li>title</li>
              <li>description</li>
              <li>price</li>
              <li>category</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Optional Columns:</h3>
            <ul className="list-disc list-inside">
              <li>tags (semicolon separated)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 text-center mb-6">
          What you'll get after upload
        </h2>
        <div className="flex flex-wrap justify-around text-center">
          <div className="w-full md:w-1/3 p-4">
            {/* <img src={fileUploadImage} alt="Smart Organization" className="mx-auto mb-4 w-16 h-16" /> */}
            <h3 className="font-semibold text-gray-800 mb-2">Smart Organization</h3>
            <p className="text-gray-600">
              Advanced filtering and search capabilities to manage your catalog efficiently
            </p>
          </div>
          <div className="w-full md:w-1/3 p-4">
            {/* <img src={optimiseImage} alt="AI Optimization" className="mx-auto mb-4 w-16 h-16" /> */}
            <h3 className="font-semibold text-gray-800 mb-2">AI Optimization</h3>
            <p className="text-gray-600">
              Get AI-powered suggestions to improve your product titles and descriptions
            </p>
          </div>
          <div className="w-full md:w-1/3 p-4">
            {/* <img src={fileUpload2Image} alt="Performance Insights" className="mx-auto mb-4 w-16 h-16" /> */}
            <h3 className="font-semibold text-gray-800 mb-2">Performance Insights</h3>
            <p className="text-gray-600">
              Track metrics and analytics to understand your catalog performance
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAndListProductsPage;

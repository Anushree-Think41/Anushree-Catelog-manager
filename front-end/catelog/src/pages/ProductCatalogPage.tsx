import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios for API calls
import type { OptimizedProduct } from "../types"; // Assuming you have an OptimizedProduct type

// Utility function to strip HTML tags
const stripHtmlTags = (htmlString: string | null | undefined): string => {
  if (!htmlString) return "";
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

const ProductCatalogPage: React.FC = () => {
  const [optimizedProducts, setOptimizedProducts] = useState<
    OptimizedProduct[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]); // New state for selected product IDs
  const navigate = useNavigate(); // Initialize useNavigate

  // Re-introducing state for search and filters, though they won't be used for optimized products initially
  const [filters, setFilters] = useState({ search: "", category: "" });
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  useEffect(() => {
    const fetchOptimizedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<OptimizedProduct[]>(
          "http://localhost:8000/products/optimized-products"
        );
        setOptimizedProducts(response.data);
      } catch (err) {
        setError("Failed to fetch optimized products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptimizedProducts();
  }, []); // Empty dependency array to fetch once on component mount

  const handleCheckboxChange = (productId: string, isChecked: boolean) => {
    setSelectedProductIds((prevSelected) =>
      isChecked
        ? [...prevSelected, productId]
        : prevSelected.filter((id) => id !== productId)
    );
  };

  const handleSelectAllChange = (isChecked: boolean) => {
    if (isChecked) {
      const allProductShopifyIds = optimizedProducts
        .map((product) => product.shopify_id)
        .filter(Boolean) as string[];
      setSelectedProductIds(allProductShopifyIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleUpdateSelected = async () => {
    if (selectedProductIds.length === 0) {
      alert("Please select at least one product to update.");
      return;
    }

    try {
      // Assuming your backend is running on http://localhost:8000
      const response = await axios.post(
        "http://localhost:8000/products/shopify/send-multiple",
        { product_ids: selectedProductIds }
      );
      console.log("Update response:", response.data);
      alert("Selected products updated successfully!");
      // Optionally, re-fetch products or update UI to reflect changes
    } catch (error) {
      console.error("Error updating selected products:", error);
      alert("Failed to update selected products.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading optimized products...
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Search Bar - Re-introduced but not functional for optimized products yet */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Product Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="form-checkbox"
              onChange={(e) => handleSelectAllChange(e.target.checked)}
              checked={
                selectedProductIds.length === optimizedProducts.length &&
                optimizedProducts.length > 0
              }
            />
            <span className="ml-2 text-sm text-gray-700">Select all</span>
          </label>
          <button
            onClick={handleUpdateSelected}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            disabled={selectedProductIds.length === 0}
          >
            Update Selected Products ({selectedProductIds.length})
          </button>
          <span className="text-sm text-gray-600">
            {optimizedProducts.length} optimized products
          </span>
        </div>

        <div className="border border-gray-200 rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
                {/* New column for actions */}</tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {(optimizedProducts || []).map((product) => (
                <tr key={product.id} className="hover:bg-gray-100">
                  {" "}
                  {/* Removed onClick from tr */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      className="form-checkbox"
                      onChange={(e) =>
                        handleCheckboxChange(
                          product.shopify_id,
                          e.target.checked
                        )
                      }
                      checked={selectedProductIds.includes(product.shopify_id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.title}
                    </div>
                    {/* Removed product.category as it's not in OptimizedProduct */}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {stripHtmlTags(product.description)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {product.price !== undefined
                      ? `${product.price.toFixed(2)}`
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {(product.tags || "")
                        .split(",")
                        .filter(Boolean)
                        .map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        navigate(`/product-comparison/${product.id}`)
                      }
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      View Insights
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalogPage;

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios"; // Import axios for API calls
import type { OptimizedProduct } from "../types"; // Assuming you have an OptimizedProduct type
import InsightsOverviewPage from "./InsightsOverviewPage";

// Utility function to strip HTML tags
const stripHtmlTags = (htmlString: string | null | undefined): string => {
  if (!htmlString) return "";
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  return doc.body.textContent || "";
};

const ProductCatalogPage: React.FC = () => {
  const [originalProducts, setOriginalProducts] = useState<OptimizedProduct[]>([]);
  const [optimizedProducts, setOptimizedProducts] = useState<
    OptimizedProduct[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]); // New state for selected product IDs
  const navigate = useNavigate(); // Initialize useNavigate

  // Re-introducing state for search and filters, though they won't be used for optimized products initially
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState("title"); // Default sort option
  const [sortOrder, setSortOrder] = useState("asc"); // 'asc' or 'desc'

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  const handleSortChange = (option: string) => {
    setSortOption(option);
    setIsSortDropdownOpen(false); // Close dropdown after selection
  };

  const handleSortOrderChange = () => {
    setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
  };

  

  useEffect(() => {
    const fetchOptimizedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get<OptimizedProduct[]>(
          "http://localhost:8000/products/optimized-products"
        );
        setOriginalProducts(response.data); // Store original data
        setOptimizedProducts(response.data); // Also set for initial display
      } catch (err) {
        setError("Failed to fetch optimized products.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOptimizedProducts();
  }, []); // Empty dependency array to fetch once on component mount

  useEffect(() => {
    let productsToDisplay = [...originalProducts];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      productsToDisplay = productsToDisplay.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm) ||
          (product.description && product.description.toLowerCase().includes(searchTerm))
      );
    }

    // Apply sorting
    const sortedAndFilteredProducts = productsToDisplay.sort((a, b) => {
      let compareValue = 0;
      if (sortOption === "title") {
        compareValue = a.title.localeCompare(b.title);
      } else if (sortOption === "price") {
        compareValue = (a.price || 0) - (b.price || 0);
      } else if (sortOption === "dateAdded") {
        // Using id as a proxy for date added
        compareValue = a.id - b.id;
      }
      return sortOrder === "asc" ? compareValue : -compareValue;
    });
    setOptimizedProducts(sortedAndFilteredProducts);
  }, [originalProducts, sortOption, sortOrder, filters]);

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

  const handleReoptimizeProduct = async (productId: number) => {
    try {
      // Assuming your backend is running on http://localhost:8000
      const response = await axios.post(
        `http://localhost:8000/products/${productId}/optimize`,
        {
          prompt: "Re-optimize this product.", // You might want a more dynamic prompt here
          product_details: {}, // This will be populated by the backend
          reoptimize: true,
        }
      );
      console.log("Re-optimization response:", response.data);
      alert("Product re-optimization started successfully!");
      // Optionally, re-fetch products or update UI to reflect changes
      // For now, just re-fetch all optimized products to see the latest
      const fetchOptimizedProducts = async () => {
        try {
          setLoading(true);
          const response = await axios.get<OptimizedProduct[]>(
            "http://localhost:8000/products/optimized-products"
          );
          setOriginalProducts(response.data);
          setOptimizedProducts(response.data);
        } catch (err) {
          setError("Failed to fetch optimized products.");
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      fetchOptimizedProducts();

    } catch (error) {
      console.error("Error re-optimizing product:", error);
      alert("Failed to re-optimize product.");
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
    <>
    {/* Search Bar */}
    <div className="mb-6 relative mt-3">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.search}
            onChange={handleSearchChange}
          />
          {/* Search Icon */}
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
    
    <div className="min-h-screen bg-gray-100">
      
      
      {/* <div className="container mx-auto p-6"> */}
        
        

        {/* Filter and Sort */}
        <div className="flex space-x-4 mb-6">
          <div className="relative">
            <button
              onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              {/* Sort Icon */}
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M3 8h18m-6 4h6m-6 4h6"></path>
              </svg>
              Sort by {sortOption.charAt(0).toUpperCase() + sortOption.slice(1)}
              {/* Dropdown Icon */}
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>
            {isSortDropdownOpen && (
              <div className="absolute z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                  <a href="#" onClick={() => handleSortChange("title")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Title</a>
                  <a href="#" onClick={() => handleSortChange("price")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Price</a>
                  <a href="#" onClick={() => handleSortChange("dateAdded")} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Date Added</a>
                  <div className="border-t border-gray-100"></div>
                  <a href="#" onClick={handleSortOrderChange} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                    Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white p-6 rounded-lg shadow-md">

      <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-blue-600"
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
              className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={selectedProductIds.length === 0}
            >
              {/* Pencil Icon */}
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.232z"></path>
              </svg>
              Update Selected Products ({selectedProductIds.length})
            </button>
          </div>
          <span className="text-sm text-gray-600">
            {selectedProductIds.length} of {optimizedProducts.length} products
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
                        .map((tag) => {
                          const colors = [
                            "bg-blue-100 text-blue-800",
                            "bg-green-100 text-green-800",
                            "bg-purple-100 text-purple-800",
                            "bg-yellow-100 text-yellow-800",
                            "bg-pink-100 text-pink-800",
                          ];
                          const colorIndex = tag.trim().length % colors.length;
                          return (
                            <span
                              key={tag}
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[colorIndex]}`}
                            >
                              {tag.trim()}
                            </span>
                          );
                        })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        navigate(`/product-comparison/${product.id}`)
                      }
                      className="text-indigo-600 hover:text-indigo-900 flex items-center justify-end mb-2"
                    >
                      {/* Eye Icon */}
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      View Insights
                    </button>
                    <button
                      onClick={() => handleReoptimizeProduct(product.id)}
                      className="text-purple-600 hover:text-purple-900 flex items-center justify-end"
                    >
                      {/* Refresh Icon */}
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004 12c0 2.114.816 4.021 2.176 5.451m-.006-.451H4v5m2.176-5.451A8.001 8.001 0 0120 12c0-2.114-.816-4.021-2.176-5.451"></path>
                      </svg>
                      Re-optimize
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    
    </>
  );
};

export default ProductCatalogPage;

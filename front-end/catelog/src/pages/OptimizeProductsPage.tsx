import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Product } from "../types";
import { getProductById } from "../api/productService";
import axios from "axios";

const OptimizeProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [messages, setMessages] = useState<
    Array<{ id: number; role: "user" | "ai"; content: string }>
  >([]);
  const [input, setInput] = useState<string>(
    "Optimize Product Details for SEO"
  );

  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);

  const handleStartOptimization = async () => {
    if (!product || !productId) {
      alert("Product not loaded. Cannot start optimization.");
      return;
    }

    setIsOptimizing(true);
    try {
      // Step 1: Sync products from Shopify
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          role: "ai",
          content: "Syncing products from Shopify...",
        },
      ]);
      await axios.post("http://localhost:8000/api/shopify/sync");
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          role: "ai",
          content: "Shopify products synced successfully. Starting optimization...",
        },
      ]);

      // Step 2: Start optimization (reusing existing logic from handleSendMessage)
      const optimizationPrompt = "Optimize Product Details for SEO"; // Default prompt for optimization
      const response = await axios.post(
        `http://localhost:8000/api/products/${productId}/optimize`,
        {
          prompt: optimizationPrompt,
          product_details: {
            title: product.title,
            description: product.description,
            tags: product.tags,
          },
        }
      );

      const aiResponseContent = `Title: ${ 
        response.data.title_suggested || product.title
      }\nDescription: ${ 
        response.data.description_suggested || product.description
      }\n\nCategory: ${response.data.suggested_category || product.category}\n\nPrice: ${product.price.toFixed(2)}\n\nTags: ${ 
        (response.data.tags_suggested || product.tags).join(", ")
      }`;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          role: "ai",
          content: aiResponseContent,
        },
      ]);

      setSuggestedTitle(response.data.title_suggested || "");
      setSuggestedDescription(response.data.description_suggested || "");
      setSuggestedTags((response.data.tags_suggested || []).join(", ") || "");

    } catch (err) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          role: "ai",
          content: "Error during optimization process. Please try again.",
        },
      ]);
      console.error("Error during optimization:", err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const [suggestedTitle, setSuggestedTitle] = useState<string>("");
  const [suggestedDescription, setSuggestedDescription] = useState<string>("");
  const [suggestedTags, setSuggestedTags] = useState<string>("");

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === "") return;

    const userMessage = {
      id: messages.length + 1,
      role: "user" as "user",
      content: input.trim(),
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    if (!product) {
      const aiError = {
        id: messages.length + 2,
        role: "ai" as "ai",
        content: "Error: Product details not loaded. Cannot optimize.",
      };
      setMessages((prevMessages) => [...prevMessages, aiError]);
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8000/api/products/${productId}/optimize`,
        {
          prompt: userMessage.content,
          product_details: {
            title: product.title,
            description: product.description,
            tags: product.tags,
          },
        }
      );

      console.log("Backend response data:", response.data); // Log the full response data

      const aiResponseContent = `Title: ${ 
        response.data.title_suggested || product.title
      }
Description: ${ 
        response.data.description_suggested || product.description
      }

Category: ${response.data.suggested_category || product.category}

Price: ${product.price.toFixed(2)}

Tags: ${ 
        (response.data.tags_suggested || product.tags).join(", ")
      }`;

      const aiResponse = {
        id: messages.length + 2,
        role: "ai" as "ai",
        content: aiResponseContent,
      };
      console.log("AI Response:", aiResponse);
      setMessages((prevMessages) => [...prevMessages, aiResponse]);

      // Update suggested values for text boxes
      setSuggestedTitle(response.data.title_suggested || "");
      setSuggestedDescription(response.data.description_suggested || "");
      setSuggestedTags((response.data.tags_suggested || []).join(", ") || "");
    } catch (err) {
      const aiError = {
        id: messages.length + 2,
        role: "ai" as "ai",
        content: "Error generating optimization. Please try again.",
      };
      setMessages((prevMessages) => [...prevMessages, aiError]);
      console.error("Error optimizing product:", err);
    }
  };

  const handleAcceptSuggestion = async () => {
    if (!product || !productId) return;

    try {
      await axios.put(`http://localhost:8000/api/products/${productId}`, {
        title: suggestedTitle,
        description: suggestedDescription,
        tags: suggestedTags.split(",").map((tag) => tag.trim()),
      });
      alert("Suggestions accepted and product updated!");
      // Optionally, clear suggestions or refetch product
    } catch (err) {
      alert("Failed to accept suggestions.");
      console.error("Error accepting suggestions:", err);
    }
  };

  const handleRejectSuggestion = () => {
    // Clear suggested values or revert to original product values
    setSuggestedTitle("");
    setSuggestedDescription("");
    setSuggestedTags("");
    alert("Suggestions rejected.");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("No product ID provided.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const fetchedProduct = await getProductById(productId);
        setProduct(fetchedProduct);
      } catch (err) {
        setError("Failed to fetch product.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading product details...
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

  if (!product) {
    return (
      <div className="flex h-screen items-center justify-center">
        Product not found.
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      {/* Left: Chat / AI Panel */}
      <div className="w-1/2 p-6 bg-gray-50 border-r border-gray-200 flex flex-col">
        <h2 className="text-2xl font-bold mb-4">AI Panel</h2>
        {/* System message */}
        <div className="bg-blue-100 p-3 rounded-lg mb-4 text-blue-800">
          Upload your products or select them to optimize.
        </div>
        <button
          onClick={handleStartOptimization}
          disabled={isOptimizing}
          className={`w-full px-4 py-2 rounded-md text-white font-semibold transition duration-300 ${ 
            isOptimizing ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          } mb-4`}
        >
          {isOptimizing ? "Optimizing..." : "Start Optimization"}
        </button>
        {/* Chat messages */}
        <div className="flex-1 overflow-y-auto mb-4 max-h-96">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`mb-2 p-2 rounded-lg shadow-sm ${ 
                m.role === "user" ? "bg-white" : "bg-green-100"
              }`}
            >
              <p className="font-semibold">
                {m.role === "user" ? "User:" : "AI:"}
              </p>
              <p>{m.content}</p>
            </div>
          ))}
        </div>
        {/* Chat input */}
        <form onSubmit={handleSendMessage} className="flex">
          <input
            className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={input}
            placeholder="Say something..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
          >
            Send
          </button>
        </form>
      </div>

      {/* Right: Product Preview Editor */}
      <div className="w-1/2 p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Product Preview Editor</h2>
        {/* Original Product Details */}
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold text-lg mb-2">
            Original Product Details
          </h3>
          <p className="text-gray-700">
            <strong>Title:</strong> {product.title}
          </p>
          <p className="text-gray-700">
            <strong>Description:</strong> {product.description}
          </p>
          <p className="text-gray-700">
            <strong>Tags:</strong> {product.tags.join(", ")}
          </p>
        </div>

        {/* Suggested Optimizations */}
        <div className="mb-6 p-4 border rounded-lg bg-white">
          <h3 className="font-semibold text-lg mb-2">
            Suggested Optimizations
          </h3>
          <div className="mb-4">
            <label
              htmlFor="suggestedTitle"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Suggested Title
            </label>
            <input
              type="text"
              id="suggestedTitle"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={suggestedTitle}
              onChange={(e) => setSuggestedTitle(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="suggestedDescription"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Suggested Description
            </label>
            <textarea
              id="suggestedDescription"
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={suggestedDescription}
              onChange={(e) => setSuggestedDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-4">
            <label
              htmlFor="suggestedTags"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Suggested Tags
            </label>
            <input
              type="text"
              id="suggestedTags"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={suggestedTags}
              onChange={(e) => setSuggestedTags(e.target.value)}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              onClick={handleRejectSuggestion}
              className="px-4 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition duration-300"
            >
              Reject
            </button>
            <button
              onClick={handleAcceptSuggestion}
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition duration-300"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OptimizeProductsPage;

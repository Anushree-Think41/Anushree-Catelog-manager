
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const uploadProducts = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${API_BASE_URL}/products/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading products:', error);
    throw error;
  }
};

export const getProducts = async (search?: string, category?: string, tags?: string[]) => {
  try {
    const params: { search?: string; category?: string; tags?: string } = {};
    if (search) {
      params.search = search;
    }
    if (category && category !== 'All Categories') {
      params.category = category;
    }
    if (tags && tags.length > 0) {
      params.tags = tags.join(','); // FastAPI expects comma-separated tags
    }

    const response = await axios.get(`${API_BASE_URL}/products`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    throw error;
  }
};

export const getUniqueFilterOptions = async () => {
  try {
    const products = await getProducts();
    const categories = new Set<string>();
    const tags = new Set<string>();

    products.forEach((product: any) => {
      if (product.category) {
        categories.add(product.category);
      }
      if (product.tags) {
        const productTags = Array.isArray(product.tags) ? product.tags : String(product.tags).split(',');
        productTags.forEach((tag: string) => tags.add(tag.trim()));
      }
    });

    // console.log(categories);
    return {
      categories: Array.from(categories),
      tags: Array.from(tags),
    };
  } catch (error) {
    console.error('Error fetching unique filter options:', error);
    throw error;
  }
};
